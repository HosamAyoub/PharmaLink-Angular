import { ChangeDetectorRef, effect, inject, Injectable, OnDestroy, OnInit, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ActivityNotification } from '../../Dashboard/Interface/activity-notification';
import { Observable } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';
import { OrdersService } from '../../orders/Services/orders-service';
import { RequestsSignalRService } from './requests-signal-r.service';
import { PharmacyService } from '../../profile/Services/pharmacy-service';

@Injectable({
  providedIn: 'root'
})
export class OrdersSignalrServiceService  {

  public hubConnection!: signalR.HubConnection;
  config = inject(ConfigService);
  pharmacyService = inject(PharmacyService);
  RequestsSignalRService = inject(RequestsSignalRService);
  orderService = inject(OrdersService);
  toastservice: ToastService = inject(ToastService);

  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  http = inject(HttpClient);
  Notifications = signal<ActivityNotification | null>(null);

  
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
