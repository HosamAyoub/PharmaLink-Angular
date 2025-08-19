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
export class RecentActivity implements OnInit {
  
  signalRService: OrdersSignalrServiceService = inject(OrdersSignalrServiceService);
  router: Router = inject(Router);
  _notifications = this.signalRService._notifications();
  today = this.signalRService.today;
  activityList = this.signalRService.activityList;

  ngOnInit(): void {
  this.signalRService.loadPharmacyOrdersNotifications().subscribe(data => {
    this.signalRService._notifications.set(data); 
  });
}


  onNotificationClick(notif: any) {
    if (notif.type === 'order' || notif.type === 'cancelOrder') {
      this.router.navigate(['pharmacy/ordersManagement']);
    } else {
      this.router.navigate(['pharmacy/medicinemanagement']);
    }
  }
}