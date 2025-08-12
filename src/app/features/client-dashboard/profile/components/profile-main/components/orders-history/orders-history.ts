import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../../../services/profile-service';
import { FormsModule } from '@angular/forms';
import { PatientOrdersService } from '../../../../services/patient-orders.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IPatientOrders } from '../../../../../shared/models/ipatient-orders';

declare var bootstrap: any;
@Component({
  selector: 'app-orders-history',
  imports: [FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.css'
})
export class OrdersHistory implements OnInit {
  profileService = inject(ProfileService);
  patientOrdersService = inject(PatientOrdersService);
  activeTab = this.profileService.activeTab;
  editMode = this.profileService.editMode;
  profile = this.profileService.profile;

  orders = this.patientOrdersService.patientOrders;
  selectedOrder?: IPatientOrders;
  private orderIdToCancel: number | null = null;

  cancelEdit() {
    this.profileService.cancelEdit();
  }
  toggleEditMode() {
    this.profileService.toggleEditMode();
  }

  ngOnInit(): void {
    this.patientOrdersService.loadPatientOrders();
  }

  openDetails(order: IPatientOrders) {
    this.selectedOrder = order;
    const modalEl = document.getElementById('orderDetailsModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  cancelOrder() {
    if (!this.orderIdToCancel) return;

    this.patientOrdersService.cancelOrder(this.orderIdToCancel).subscribe({
      next: (res) => {
        console.log('Order cancelled:', res);
        this.orders.set(this.orders().filter(o => o.orderId !== this.orderIdToCancel));
        this.patientOrdersService.loadPatientOrders();
        this.closCanceleModal();
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
      }
    });

  }

  openCancelModal(orderId: number) {
    this.orderIdToCancel = orderId;
    const modalElement = document.getElementById('cancelOrderModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  closCanceleModal() {
    const modalElement = document.getElementById('cancelOrderModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.orderIdToCancel = null;
  }
}
