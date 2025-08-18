import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrdersSignalrServiceService } from '../Services/orders-signalr-service.service';
import { PharmacyService } from '../../profile/Services/pharmacy-service';
import { OrdersService } from '../../orders/Services/orders-service';
import { CommonModule } from '@angular/common';
import { RequestsSignalRService } from '../Services/requests-signal-r.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ActivityNotification } from '../../Dashboard/Interface/activity-notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  signalRService = inject(OrdersSignalrServiceService);
  pharmacyService = inject(PharmacyService);
  RequestsSignalRService = inject(RequestsSignalRService);
  orderService = inject(OrdersService);
  toastservice : ToastService = inject(ToastService);
  cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.RequestsSignalRService.startConnection();
    this.pharmacyService.getPharmacyProfile().subscribe({
      next: (pharmacy) => {
        const pharmacyId = pharmacy.pharmacyID;

        if (pharmacyId) {
          this.signalRService.startConnection(pharmacyId);
          this.subscribeToNewOrders();
          this.adminRequestReplay();
          this.subscribeToCancelOrder();
        }
      },
      error: (err) => {
        console.error('Failed to load pharmacy profile:', err);
      }
    });
  }

  private subscribeToNewOrders() {
    this.signalRService.hubConnection.on('NewOrder', () => {
      this.playSound();
      this.toastservice.showSuccess("New Order Received!");
      this.orderService.loadOrders();
      this.signalRService.loadPharmacyOrdersNotifications().subscribe({
        next: (res: ActivityNotification | null ) => {
          this.signalRService.Notifications.set(res);
          console.log('Received notifications:', this.signalRService.Notifications);
          this.cd.detectChanges();
        }
      });
    });
  }

  private subscribeToCancelOrder() {
    this.signalRService.hubConnection.on('CancelOrder', () => {
      this.playSound();
      this.toastservice.showError("Order has been Cancelled!");
      this.orderService.loadOrders();
      this.cd.detectChanges();
    });
  }

  adminRequestReplay() {
    this.RequestsSignalRService.hubConnection.on('DrugRequestRejected', (message) => {
      console.log("your request has been rejected:", message);
      this.playSound();
      this.toastservice.showError("Your request has been rejected!");
      this.signalRService.loadPharmacyOrdersNotifications().subscribe({
        next: (res: ActivityNotification | null ) => {
          this.signalRService.Notifications.set(res);
          this.cd.detectChanges();
        }
      });
    });
     this.RequestsSignalRService.hubConnection.on('DrugRequestAccepted', (message) => {
      console.log("your request has been accepted:", message);
      this.playSound();
      this.toastservice.showSuccess("Your request has been accepted!");
      this.signalRService.loadPharmacyOrdersNotifications().subscribe({
        next: (res: ActivityNotification | null ) => {
          this.signalRService.Notifications.set(res);
          this.cd.detectChanges();
        }
      });
    });
  }


  ngOnDestroy(): void {
    this.signalRService.stopConnection();
  }

  private playSound() {
    const audio = new Audio();
    audio.src = 'assets/notification.mp3';
    audio.play().catch(err => {
      console.warn('Failed to play audio:', err);
    });
    audio.play();
  }

}
