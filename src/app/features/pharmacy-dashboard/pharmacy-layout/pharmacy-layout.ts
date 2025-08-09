import { Component, inject, Inject } from '@angular/core';
 import { RouterOutlet } from '@angular/router';
import { NotificationsComponent } from '../orders/Shared/Components/notifications/notifications.component';
import { OrdersSignalrServiceService } from '../orders/Shared/Services/orders-signalr-service.service';
import { th } from 'date-fns/locale';
@Component({
  selector: 'app-pharmacy-layout',
  imports: [RouterOutlet, NotificationsComponent],
templateUrl: './pharmacy-layout.html',
  styleUrls: ['./pharmacy-layout.css']
})
export class PharmacyLayout {
 orderSignal = inject(OrdersSignalrServiceService);

 public showPopup = this.orderSignal;
 
}
