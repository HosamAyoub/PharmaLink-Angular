import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../Interfaces/iorder';
import { ConfigService } from '../../../../shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  orders = signal<IOrder[]>([]);
  countdowns = signal<Record<number, string>>({});
  constructor(private http: HttpClient, private configService: ConfigService) { }

  getAllOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.configService.getApiUrl('orders/orders'));
  }

  loadOrders() {
    this.getAllOrders().subscribe(data => {
      this.orders.set(data);
      this.startAutoRejectAndCountdownTimer();
    });
  }

  markAsInReview(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/reviewing') + `/${orderId}`, {});
  }

  markAsPending(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/pending') + `/${orderId}`, {});
  }

  markAsOutForDelivery(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/outForDelivery') + `/${orderId}`, {});
  }

  markAsDelivered(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/delivered') + `/${orderId}`, {});
  }

  rejectOrder(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/reject') + `/${orderId}`, {});
  }

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
        this.rejectOrder(order.orderID).subscribe(() => {
          console.log(`Order ${order.orderID} auto-rejected`);
          this.loadOrders();
        });
      }

    }, 1000);
  }
  private readonly statusExpiryMinutes: Record<string, number> = {
    UnderReview: 10,
    Reviewing: 15,
    Pending: 30
  };

}
