import { Component, Input, OnInit, OnChanges, effect, signal, inject, WritableSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivityNotification } from '../../Interface/activity-notification';
import { OrdersSignalrServiceService } from '../../../Shared/Services/orders-signalr-service.service';
import { DrugStatus } from '../../../../../shared/enums/drug-status';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-activity',
  imports: [DatePipe],
  templateUrl: './recent-activity.html',
  styleUrls: ['./recent-activity.css']
})
export class RecentActivity {
  activityList: any[] = [];
  signalRService: OrdersSignalrServiceService = inject(OrdersSignalrServiceService);
  router: Router = inject(Router);
  private _notifications = signal<ActivityNotification | null>(null);

@Input() set notifications(value: ActivityNotification | null) {
  this._notifications.set(value);
}

  constructor() {
   effect((_notifications) => {
     this.prepareActivityList();
   });
  }

  prepareActivityList() {
    console.log('Received notifications:', this._notifications());
    this.activityList = [];
    if (!this._notifications()) return;

    // Add order notifications
    if (this._notifications()?.orderNotifications) {
      this.activityList.push(
        ...((this._notifications()?.orderNotifications as Array<any>) ?? []).map((order: any) => ({
          type: 'order',
          title: 'New Order',
          message: order.message,
          timestamp: order.timestamp,
          status: order.status,
          orderID: order.orderID
        }))
      );
    }

    // Add cancel order notifications
    if (this.notifications.cancelOrderNotification) {
      this.activityList.push(
        ...this.notifications.orderNotifications.map(order => ({
          type: 'cancelOrder',
          title: 'Order Cancelled',
          message: order.message,
          timestamp: order.timestamp,
          status: order.status,
          orderID: order.orderID
        }))
      );
    }

    // Add drug request notifications
    if (this._notifications()?.drugRequestNotifications) {
      this.activityList.push(
        ...(this._notifications()?.drugRequestNotifications as Array<any> ?? []).map((drug: any) => ({
          type: 'drug',
          title: 'Drug Request',
          message: `Your Request for "${drug.commonName}" has been ${drug.drugStatus === DrugStatus.Approved ? 'approved' : 'rejected'}.`,
          timestamp: drug.timestamp,
          drugStatus: drug.drugStatus,
          drugID: drug.drugID,
          isRead: drug.isRead
        }))
      );
    }

    // Sort by timestamp descending
    this.activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }


  onNotificationClick(notif: any) {
    if (notif.type === 'order' || notif.type === 'cancelOrder') {
      this.router.navigate(['pharmacy/ordersManagement']);
    } else {
      this.router.navigate(['pharmacy/medicinemanagement']);
    }
  }



}