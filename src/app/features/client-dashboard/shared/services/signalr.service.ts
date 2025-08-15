import { computed, inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { ConfigService } from '../../../../shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public connection!: signalR.HubConnection;
  showPopup = false;
  notificationMessage: string = '';
  notifications = signal<any[]>([]);
  config = inject(ConfigService);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  http = inject(HttpClient)

  unreadCount = computed(() =>
    this.notifications().filter(n => !n.read).length
  );
  startConnection() {
    const userData = localStorage.getItem('userData');
    let token = '';

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        token = parsedUser._token;
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
    console.log('Token being sent to SignalR:', token);

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5278/hubs/statusChangeHub', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.connection
      .start()
      .then(() => console.log('Notification hub connected'))
      .catch(err => console.error('SignalR connection error:', err));
  }

  stopConnection() {
    if (this.connection) {
      this.connection.stop();
      this.showPopup = false;
    }
  }

  loadNotificationsFromApi() {
    this.http.get<any[]>(this.config.getApiUrl('notifications/notifications'))
      .subscribe({
        next: (res) => {
        const mapped = res.map(n => ({
          ...n,
          title: 'Order Update',
          read: n.isRead
        }));
        this.notifications.set(mapped);
        console.log(this.notifications());
      },
        error: (err) => {
          console.error('Error loading notifications:', err);
        }
      });
  }

  markAllAsRead() {
  this.http.post(this.config.getApiUrl('notifications/markAllAsRead'), {})
    .subscribe({
      next: () => {
      const updated = this.notifications().map(n => ({ ...n, isRead: true }));
      this.notifications.set(updated);
      this.loadNotificationsFromApi();
    },
      error: err => console.error('Error marking as read:', err)
    });
}

}
