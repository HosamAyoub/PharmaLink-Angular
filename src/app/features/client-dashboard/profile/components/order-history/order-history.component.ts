import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoadingSpinner } from '../../../../../shared/components/loading-spinner/loading-spinner';
import { DateService } from '../../../../../shared/services/date.service';

interface Order {
  id: string;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
  total: number;
  items: OrderItem[];
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [LoadingSpinner, DatePipe],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
  isLoading = signal(false);
  orders: Order[] = [];

  private dateService = inject(DateService);

  ngOnInit() {
    this.loadOrderHistory();
  }

  // Alternative method using DateService instead of DatePipe
  formatOrderDate(date: Date): string {
    return this.dateService.formatMediumDate(date);
  }

  loadOrderHistory() {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      // Mock data - replace with actual API call
      this.orders = [
        {
          id: 'ORD-001',
          date: new Date('2024-01-15'),
          status: 'completed',
          total: 45.99,
          items: [
            { name: 'Aspirin 100mg', quantity: 1, price: 12.99 },
            { name: 'Vitamin D3', quantity: 2, price: 16.5 },
          ],
        },
        {
          id: 'ORD-002',
          date: new Date('2024-01-10'),
          status: 'completed',
          total: 23.5,
          items: [{ name: 'Ibuprofen 400mg', quantity: 1, price: 23.5 }],
        },
      ];
      this.isLoading.set(false);
    }, 600);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }
}
