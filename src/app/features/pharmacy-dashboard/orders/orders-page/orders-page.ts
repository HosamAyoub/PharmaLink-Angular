import { Component, computed, signal } from '@angular/core';
import { IOrder } from '../Interfaces/iorder';
import { OrdersService } from '../Services/orders-service';
import { CommonModule } from '@angular/common';
import { OrderDetailsModal } from '../Components/order-details-modal/order-details-modal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-page',
  imports: [CommonModule, OrderDetailsModal, RouterLink],
  standalone: true,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css'
})
export class OrdersPage {
  orders = signal<IOrder[]>([]);
  query = signal('');
  selectedStatus = signal<string>('All');
  orderDetails = signal<any | null>(null);
  showModal = signal(false);
  countdowns = signal<Record<number, string>>({});


  constructor(private ordersService: OrdersService) { }

  filteredOrders = computed(() => {
    let result = this.orders()
      .filter(order =>
        order.name.toLowerCase().includes(this.query().toLowerCase()) ||
        order.orderID.toString().includes(this.query())
      );

    if (this.selectedStatus() !== 'All') {
      result = result.filter(order => order.status === this.selectedStatus());
    }

    return result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  });

  get orderCount() {
    return this.filteredOrders().length;
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

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getAllOrders().subscribe(data => {
      this.orders.set(data);
      this.startAutoRejectAndCountdownTimer();
    });
  }


  onQueryChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  refresh() {
    this.loadOrders();
  }

  onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value);
  }

  updateStatus(order: IOrder, status: string) {
    const id = order.orderID;
    switch (status) {
      case 'pending':
        this.ordersService.markAsPending(id).subscribe(() => this.refresh());
        break;
      case 'out-for-delivery':
        this.ordersService.markAsOutForDelivery(id).subscribe(() => this.refresh());
        break;
      case 'delivered':
        this.ordersService.markAsDelivered(id).subscribe(() => this.refresh());
        break;
      case 'rejected':
        this.ordersService.rejectOrder(id).subscribe(() => this.refresh());
        break;
    }
  }

  viewOrder(orderId: number) {
    console.log('Fetching order details for ID:', orderId);
    this.ordersService.markAsInReview(orderId).subscribe({
      next: data => {
        console.log('Order details received:', data);
        this.orderDetails.set(data);
        this.showModal.set(true);
        this.refresh();
      }
    });
  }


  closeModal = () => {
    this.showModal.set(false);
  };


  getProgress(status: string): number {
    switch (status) {
      case 'UnderReview': return 20;
      case 'Reviewing': return 40;
      case 'Pending': return 60;
      case 'OutForDelivery': return 80;
      case 'Delivered': return 100;
      case 'Rejected': return 0;
      default: return 0;
    }
  }

  getProgressColor(status: string): string {
    switch (status) {
      case 'Rejected': return 'bg-error-red-light';
      case 'Delivered': return 'bg-success-green';
      case 'Pending': return 'bg-warning-custom';
      case 'Reviewing': return 'bg-purple-custom';
      case 'OutForDelivery': return 'bg-orange-custom';
      case 'UnderReview': return 'bg-blue-navbar';
      default: return 'bg-secondary-custom';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'UnderReview': return 'fas fa-clock text-blue-navbar';
      case 'Reviewing': return 'fas fa-search text-purple-custom';
      case 'Pending': return 'fas fa-exclamation-triangle text-warning-custom';
      case 'OutForDelivery': return 'fas fa-truck text-orange-custom';
      case 'Delivered': return 'fas fa-check-circle text-success-green';
      case 'Rejected': return 'fas fa-times-circle text-error-red';
      default: return 'fas fa-question-circle text-secondary-custom';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'UnderReview': return 'bg-primary-blue-light text-blue-navbar';
      case 'Reviewing': return 'bg-purple-light text-purple-custom';
      case 'Pending': return 'bg-warning-light text-warning-custom';
      case 'OutForDelivery': return 'bg-orange-light text-orange-custom';
      case 'Delivered': return 'bg-success-green-light text-success-green';
      case 'Rejected': return 'bg-error-red-light text-error-red';
      default: return 'bg-secondary-subtle text-secondary-custom';
    }
  }

  getStatusDisplay(status: string): string {
    switch (status) {
      case 'UnderReview': return 'Under Review';
      case 'Reviewing': return 'Reviewing';
      case 'Pending': return 'Pending';
      case 'OutForDelivery': return 'Out for Delivery';
      case 'Delivered': return 'Delivered';
      case 'Rejected': return 'Rejected';
      default: return status;
    }
  }

  exportOrdersAsCSV() {
    const orders = this.filteredOrders();
    const csvRows = [];

    // Header row
    const headers = ['Order ID', 'Patient Name', 'Status', 'Total Price'];
    csvRows.push(headers.join(','));

    // Data rows
    orders.forEach(order => {
      csvRows.push([
        order.orderID,
        `"${order.name}"`,
        order.status,
        order.totalPrice
      ].join(','));
    });

    // Create and download CSV
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private readonly statusExpiryMinutes: Record<string, number> = {
    UnderReview: 10,
    Reviewing: 15,
    Pending: 30
  };

  startAutoRejectAndCountdownTimer() {
    setInterval(() => {
      const now = new Date().getTime();
      const countdownMap: Record<number, string> = {};
      const ordersToReject: IOrder[] = [];

      for (const order of this.orders()) {
        const expiryMinutes = this.statusExpiryMinutes[order.status];
        if (!expiryMinutes) continue;

        if (
          !order.statusLastUpdated ||
          new Date(order.statusLastUpdated).getFullYear() <= 1900
        ) {
          continue;
        }

        const startTime = new Date(order.statusLastUpdated).getTime();
        const endTime = startTime + expiryMinutes * 60_000;
        const remainingMs = endTime - now;

        // Update countdown
        if (remainingMs > 0) {
          const minutes = Math.floor(remainingMs / 60000);
          const seconds = Math.floor((remainingMs % 60000) / 1000);
          countdownMap[order.orderID] = `in ${minutes}m ${seconds}s`;
        } else {
          countdownMap[order.orderID] = 'soon...';
          ordersToReject.push(order); // Mark for rejection
        }
      }

      // Update countdowns
      this.countdowns.set(countdownMap);

      // Reject orders that expired
      for (const order of ordersToReject) {
        this.ordersService.rejectOrder(order.orderID).subscribe(() => {
          console.log(`Order ${order.orderID} auto-rejected`);
          this.refresh();
        });
      }

    }, 1000);
  }

}
