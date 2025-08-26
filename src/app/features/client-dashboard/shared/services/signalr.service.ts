import { computed, inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { ConfigService } from '../../../../shared/services/config.service';
import { th } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  public connection!: signalR.HubConnection;
  patientNotifications = signal<any[]>([]);
  config: ConfigService = inject(ConfigService);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  http = inject(HttpClient);

  unreadCount = computed(
    () => this.patientNotifications().filter((n) => !n.read).length
  );
  startConnection() {
    const userData = localStorage.getItem('userData');
    // const config = inject(ConfigService);
    const StatusChangeUrl = this.config.getHubUrl(
      this.endPoint.STATUSCHANGE_HUB
    );
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
      .withUrl(StatusChangeUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.connection
      .start()
      .then(() => console.log('Notification hub connected'))
      .catch((err) => console.error('SignalR connection error:', err));
  }

  stopConnection() {
    if (this.connection) {
      this.connection.stop();
    }
  }

  loadNotificationsFromApi() {
    this.http
      .get<any[]>(this.config.getApiUrl('notifications/notifications'))
      .subscribe({
        next: (res) => {
          const mapped = res.map((n) => ({
            ...n,
            title: 'Order Update',
            read: n.isRead,
          }));
          this.patientNotifications.set(mapped);
          console.log(this.patientNotifications());
        },
        error: (err) => {
          console.error('Error loading notifications:', err);
        },
      });
  }

  markAllAsRead() {
    this.http
      .post(this.config.getApiUrl('notifications/markAllAsReadForPatient'), {})
      .subscribe({
        next: () => {
          const updated = this.patientNotifications().map((n) => ({
            ...n,
            isRead: true,
          }));
          this.patientNotifications.set(updated);
          this.loadNotificationsFromApi();
        },
        error: (err) => console.error('Error marking as read:', err),
      });
  }
}
