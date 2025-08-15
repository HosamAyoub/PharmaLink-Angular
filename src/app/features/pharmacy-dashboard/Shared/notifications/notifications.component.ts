import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrdersSignalrServiceService } from '../Services/orders-signalr-service.service';
import { PharmacyService } from '../../profile/Services/pharmacy-service';
import { OrdersService } from '../../orders/Services/orders-service';
import { CommonModule } from '@angular/common';
import { RequestsSignalRService } from '../Services/requests-signal-r.service';

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
  cd = inject(ChangeDetectorRef);

  showPopup = this.signalRService.showPopup;
  message = '';

  ngOnInit(): void {
    this.orderService.loadOrders();
    this.RequestsSignalRService.startConnection();
    this.pharmacyService.getPharmacyProfile().subscribe({
      next: (pharmacy) => {
        const pharmacyId = pharmacy.pharmacyID;

        if (pharmacyId) {
          this.signalRService.startConnection(pharmacyId);
          this.subscribeToNewOrders();
        }
      },
      error: (err) => {
        console.error('Failed to load pharmacy profile:', err);
      }
    });
    this.adminRequestReplay();
  }

  private subscribeToNewOrders() {
    this.signalRService.hubConnection.on('NewOrder', () => {
      this.showPopup = true;
      this.playSound();
      this.message = 'New Order Received!';
      this.orderService.loadOrders();
      this.cd.detectChanges();

      setTimeout(() => {
        this.showPopup = false;
        this.cd.detectChanges();
      }, 5000);
    });
  }

  adminRequestReplay() {
    this.RequestsSignalRService.adminNotification().then(() => {
      this.showPopup = true;
      this.playSound();
      this.message = 'Admin Request Replayed!';
      this.cd.detectChanges();

      setTimeout(() => {
        this.showPopup = false;
        this.cd.detectChanges();
      }, 5000);
    });
  }

  closePopup() {
    this.showPopup = false;
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
