import { computed, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public connection!: signalR.HubConnection;
  showPopup = false;
  notificationMessage: string = '';
  // notifications: any[] = []; 

  // بدل ما تكون array عادية نخليها signal
  notifications = signal<any[]>([]);

  // عدد الرسائل الغير مقروءة كـ computed signal
  unreadCount = computed(() =>
    this.notifications().filter(n => !n.read).length
  );
  constructor() { }

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

    // this.connection.on('ReceiveNotification', (payload: any) => {
    //   console.log('Notification:', payload);
    //   this.notificationMessage = payload.message;
    //   this.showPopup = true;
    // });

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

  addNotification(payload: any) {
    const newNotif = {
      title: payload.title || 'Order Update',
      message: payload.message,
      status: payload.status || 'info', 
      timestamp: new Date(),
      read: false
    };

    this.notifications.update(n => [newNotif, ...n].slice(0, 50));
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }


  loadNotificationsFromStorage() {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      this.notifications.set(JSON.parse(saved));
    }
  }

  markAllAsRead() {
    this.notifications.update(n =>
      n.map(notif => ({ ...notif, read: true }))
    );
    localStorage.setItem('notifications', JSON.stringify(this.notifications()));
  }

  clearNotifications() {
    this.notifications.set([]);
    localStorage.removeItem('notifications');
  }


}
