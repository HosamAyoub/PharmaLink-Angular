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
import { DrugStatus } from '../../../../shared/enums/drug-status';

@Injectable({
  providedIn: 'root'
})
export class OrdersSignalrServiceService {

  public hubConnection!: signalR.HubConnection;
  config = inject(ConfigService);
  pharmacyService = inject(PharmacyService);
  RequestsSignalRService = inject(RequestsSignalRService);
  orderService = inject(OrdersService);
  toastservice: ToastService = inject(ToastService);

  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  http = inject(HttpClient);
  // Notifications = signal<ActivityNotification | null>(null);

  activityList = signal<any[]>([]);
  _notifications = signal<ActivityNotification | null>(null);
  today = this.getStartOfDay(new Date());

  constructor() {
    effect(() => {
      this.prepareActivityList();
    });
  }


  startConnection(pharmacyId: number) {
    const OrderHubUrl = this.config.getHubUrl(APP_CONSTANTS.API.ENDPOINTS.ORDER_HUB);
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(OrderHubUrl)
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


  prepareActivityList() {
    console.log('Received notifications:', this._notifications());
    if (!this._notifications()) {
      this.activityList.set([]);
      return;
    }

    let tempList: any[] = [];

    // Add order notifications
    if (this._notifications()?.orderNotifications) {
      tempList.push(
        ...((this._notifications()?.orderNotifications as Array<any>) ?? [])
          .filter((order: any) => this.getStartOfDay(new Date(order.timestamp)) === this.today)
          .map((order: any) => ({
            type: order.status === 'Cancelled' ? 'cancelOrder' : 'order',
            title: order.status === 'Cancelled' ? 'Order Cancelled' : 'New Order',
            message: order.message,
            timestamp: order.timestamp,
            status: order.status,
            orderID: order.orderID
          }))
      );
    }

    // Add drug request notifications
    if (this._notifications()?.drugRequestNotifications) {
      tempList.push(
        ...(this._notifications()?.drugRequestNotifications as Array<any> ?? []).filter((drug: any) => this.getStartOfDay(new Date(drug.timestamp)) === this.today)
          .map((drug: any) => ({
            type: 'drug',
            title: 'Drug Request',
            message: `Your Request for "${drug.commonName}" has been ${drug.drugStatus === DrugStatus.Approved ? 'approved' : 'rejected'
              }.`,
            timestamp: drug.timestamp,
            drugStatus: drug.drugStatus,
            drugID: drug.drugID,
            isRead: drug.isRead
          }))
      );
    }

    tempList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    this.activityList.set(tempList);
  }

  private getStartOfDay(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
}
