import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from '../../services/signalr.service';
import { PatientOrdersService } from '../../../profile/services/patient-orders.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-status-change',
  standalone: true,
  imports: [],
  templateUrl: './status-change.component.html',
  styleUrl: './status-change.component.css'
})
export class StatusChangeComponent implements OnInit, OnDestroy {
  signalrService = inject(SignalrService)
  toastservice = inject(ToastService);
  cd = inject(ChangeDetectorRef);
  ordersHistoryService = inject(PatientOrdersService)
  ngOnInit() {
    this.signalrService.startConnection();
    this.signalrService.loadNotificationsFromApi();
    this.subscribeToNewOrderStatus()
    this.cd.detectChanges();
  }



  private subscribeToNewOrderStatus() {
    this.signalrService.connection.on('ReceiveNotification', (payload: any) => {
      console.log('Notification:', payload);
      if (payload.status == "Rejected")
        this.toastservice.showError(payload.message);
      else
        this.toastservice.showSuccess(payload.message);
      this.playSound();

      this.signalrService.loadNotificationsFromApi();
      this.cd.detectChanges();

      this.ordersHistoryService.loadPatientOrders();
      this.cd.detectChanges();

      setTimeout(() => {
        this.cd.detectChanges();
      }, 5000);
    });
  }

  private playSound() {
    const audio = new Audio();
    audio.src = 'assets/notification.mp3';
    audio.play().catch(err => {
      console.warn('Failed to play audio:', err);
    });
    audio.play();
  }
  ngOnDestroy() {
    this.signalrService.stopConnection();
  }
}
