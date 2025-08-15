import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersSignalrServiceService {
  public hubConnection!: signalR.HubConnection;
  showPopup = false;

  pharmacyNotifications = signal<any[]>([]);
  config = inject(ConfigService);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  http = inject(HttpClient)

  startConnection(pharmacyId: number) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5278/orderHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.hubConnection.invoke("JoinGroup", pharmacyId.toString());
      })
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  loadPharmacyOrdersNotifications() {
    this.http.get<any[]>(this.config.getApiUrl('notifications/pharmacyOrdersNotifications'))
      .subscribe({
        next: (res) => {
          const mapped = res.map(n => ({
            ...n,
            title: 'New Order'
          }));
          this.pharmacyNotifications.set(mapped);
          console.log(this.pharmacyNotifications());
        },
        error: (err) => {
          console.error('Error loading notifications:', err);
        }
      });
  }

}
