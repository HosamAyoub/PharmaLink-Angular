import { ChangeDetectorRef, effect, inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ActivityNotification } from '../../Dashboard/Interface/activity-notification';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersSignalrServiceService {

  public hubConnection!: signalR.HubConnection;
  config = inject(ConfigService);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  http = inject(HttpClient);


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


  loadPharmacyOrdersNotifications(): Observable<ActivityNotification | null> {
    const url = this.config.getApiUrl(APP_CONSTANTS.API.ENDPOINTS.PHARMACY_NOTIFICATIONS);
    return this.http.get<ActivityNotification>(url);
  }


}
