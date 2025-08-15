import { Component, inject, OnInit } from '@angular/core';
import { OrdersSignalrServiceService } from '../../../Shared/Services/orders-signalr-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-recent-activity',
  imports: [DatePipe],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.css'
})
export class RecentActivity implements OnInit {
  sigalrService = inject(OrdersSignalrServiceService)
  pharmacyNotifications = this.sigalrService.pharmacyNotifications;

  ngOnInit(): void {
    this.sigalrService.loadPharmacyOrdersNotifications();
  }
}
