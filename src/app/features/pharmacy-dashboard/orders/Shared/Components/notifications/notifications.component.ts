import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrdersSignalrServiceService } from '../../Services/orders-signalr-service.service';
import { PharmacyService } from '../../../../profile/Services/pharmacy-service';
import { OrdersService } from '../../../Services/orders-service';
import { CommonModule } from '@angular/common';

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
  orderService = inject(OrdersService);
  cd = inject(ChangeDetectorRef);

  showPopup = this.signalRService.showPopup;


  ngOnInit(): void {
    this.orderService.loadOrders();

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
  }

  private subscribeToNewOrders() {
    this.signalRService.hubConnection.on('NewOrder', () => {
      this.showPopup = true;
      this.playSound();
      this.orderService.loadOrders();
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
