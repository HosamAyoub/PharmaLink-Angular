import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AdminOrdersServiceService } from '../Service/admin-orders-service.service';
import { IPatientOrders } from '../../../client-dashboard/shared/models/ipatient-orders';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;
@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css'
})
export class OrdersPageComponent {
  AdmintOrdersService = inject(AdminOrdersServiceService);

  orders = this.AdmintOrdersService.AdminOrders;
  selectedOrder?: IPatientOrders;
  private orderIdToCancel: number | null = null;
   query = signal('');
   selectedStatus = signal<string>('All');

  ngOnInit(): void {
    this.AdmintOrdersService.loadOrders();
  }

  filteredOrders = computed(() => {
    let result = this.orders()
      .filter(order =>
        order.pharmacyName.toLowerCase().includes(this.query().toLowerCase()) ||
        order.orderId.toString().includes(this.query())
      );

    if (this.selectedStatus() !== 'All') {
      result = result.filter(order => order.status === this.selectedStatus());
    }

    return result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  });

  openDetails(order: IPatientOrders) {
    this.selectedOrder = order;
    const modalEl = document.getElementById('orderDetailsModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  exportOrdersAsCSV() {}

  get orderCount() {
    return this.orders().length;
  }

  get activeOrdersCount(): number {
    return this.orders().filter(o =>
      ['Pending', 'UnderReview', 'Reviewing'].includes(o.status)
    ).length;
  }

  get outForDeliveryCount(): number {
    return this.orders().filter(o => o.status === 'OutForDelivery').length;
  }

  get deliveredCount(): number {
    return this.orders().filter(o => o.status === 'Delivered').length;
  }

  get rejectedCount(): number {
    return this.orders().filter(o => o.status === 'Rejected').length;
  }

  onQueryChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }
  onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value);
  }
}
