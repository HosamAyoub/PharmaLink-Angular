import { Component, Input, OnInit, OnChanges, effect, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivityNotification } from '../../Interface/activity-notification';
import { OrdersSignalrServiceService } from '../../../Shared/Services/orders-signalr-service.service';
import { DrugStatus } from '../../../../../shared/enums/drug-status';




@Component({
  selector: 'app-recent-activity',
  imports: [DatePipe],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.css'
})
export class RecentActivity implements OnInit, OnChanges {
  notifications: ActivityNotification | null = null;
  signalRService: OrdersSignalrServiceService = inject(OrdersSignalrServiceService);
  activityList: any[] = [];


  constructor() {
    this.signalRService.loadPharmacyOrdersNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.prepareActivityList();
      },
      error: (err) => {
        console.error('Error loading pharmacy orders notifications:', err);
      }
    });
  }

  ngOnInit(): void {
    this.signalRService.loadPharmacyOrdersNotifications().subscribe({
      next: (notifications) => {
        console.log('Initial Notifications:', notifications);
        this.notifications = notifications;
        this.prepareActivityList();
        console.log('Activity List Initialized:', this.activityList);
      },
      error: (err) => {
        console.error('Error loading pharmacy orders notifications:', err);
      }
    });
  }

  ngOnChanges(): void {
    this.signalRService.loadPharmacyOrdersNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.prepareActivityList();
        console.log('Activity List Updated:', this.activityList);
      },
      error: (err) => {
        console.error('Error loading pharmacy orders notifications:', err);
      }
    });
  }

  prepareActivityList() {
    console.log('Received notifications:', this.notifications);
    this.activityList = [];
    if (!this.notifications) return;

    // Add order notifications
    if (this.notifications.orderNotifications) {
      this.activityList.push(
        ...this.notifications.orderNotifications.map(order => ({
          type: 'order',
          title: 'New Order',
          message: order.message,
          timestamp: order.timestamp,
          status: order.status,
          orderID: order.orderID
        }))
      );
    }

    // Add drug request notifications
    if (this.notifications.drugRequestNotifications) {
      this.activityList.push(
        ...this.notifications.drugRequestNotifications.map(drug => ({
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
}