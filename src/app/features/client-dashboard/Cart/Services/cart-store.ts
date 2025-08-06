import { inject, Injectable, signal } from '@angular/core';
import { CartItem } from '../Interfaces/cart-item';
import { OrderSummary } from '../Interfaces/order-summary';
import { CartService } from './cart-service';
import { CartUpdateDto } from '../Interfaces/cart-update-dto';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  // Signals
  cartItems = signal<CartItem[]>([]);
  orderSummary = signal<OrderSummary | null>(null);
  public isLoading = signal<boolean>(false);

  constructor(private cartService: CartService, private http: HttpClient, private router: Router, private config: ConfigService) { }

  // Load cart summary from API
  loadCart(): Subscription {
    return this.cartService.getCartSummary().subscribe({
      next: (data) => {
        this.cartItems.set(data.cartItems);
        this.orderSummary.set(data.orderSummary);
        this.updateTotals();
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
      }
    });
  }

  // Actions
  increment(item: CartItem) {
    const dto: CartUpdateDto = {
      drugId: item.drugId,
      pharmacyId: item.pharmacyId,
      quantity: item.quantity
    };

    this.cartService.incrementItem(dto).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Increment error:', err)
    });
  }

  decrement(item: CartItem) {
    const dto: CartUpdateDto = {
      drugId: item.drugId,
      pharmacyId: item.pharmacyId,
      quantity: item.quantity
    };

    if (item.quantity === 1) {
      const updated = this.cartItems().filter(x =>
        !(x.drugId === item.drugId && x.pharmacyId === item.pharmacyId)
      );
      this.cartItems.set(updated);

      this.cartService.decrementItem(dto).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Decrement error:', err)
      });
    } else {
      const updated = this.cartItems().map(x => {
        if (x.drugId === item.drugId && x.pharmacyId === item.pharmacyId) {
          return { ...x, quantity: x.quantity - 1 };
        }
        return x;
      });
      this.cartItems.set(updated);

      this.cartService.decrementItem(dto).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Decrement error:', err)
      });
    }
  }


  remove(item: CartItem) {
    const dto: CartUpdateDto = {
      drugId: item.drugId,
      pharmacyId: item.pharmacyId,
      quantity: item.quantity
    };

    this.cartService.removeItemFromCart(dto).subscribe({
      next: () => {
        // Filter the removed item locally
        const updated = this.cartItems().filter(x =>
          !(x.drugId === item.drugId && x.pharmacyId === item.pharmacyId)
        );
        this.cartItems.set(updated);
        this.updateTotals();
      },
      error: (err) => console.error('Remove error:', err)
    });
  }

  clearCart(): Subscription {
    return this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems.set([]);
        const summary = this.orderSummary();
        if (summary) {
          summary.subtotal = 0;
          summary.total = summary.deliveryFee;
          this.orderSummary.set({ ...summary });
        }
      },
      error: (err) => {
        console.error('Clear cart failed', err);
      }
    });
  }
  // Recalculate totals
  updateTotals() {
    const items = this.cartItems();
    const summary = this.orderSummary();
    if (!summary) return;

    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    summary.subtotal = subtotal;
    summary.total = subtotal + summary.deliveryFee;

    this.orderSummary.set({ ...summary });
  }

  checkout(paymentMethod: string): Subscription | undefined {
    const summary = this.orderSummary();
    if (!summary) return;

    if (summary.total < 30) {
      const modal = new bootstrap.Modal(document.getElementById('minOrderModal')!);
      modal.show();
      return;
    }

    this.isLoading.set(true);

    return this.http.post<any>(this.config.getApiUrl(this.ENDPOINTS.ORDERS_SUBMIT), { paymentMethod }).subscribe({
      next: (res) => {
        if (paymentMethod === 'cash') {
          this.router.navigate(['/client/success'], { queryParams: { orderId: res.orderId, paymentMethod: 'cash' } });
        } else {
          this.createStripeSession();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Order submission failed', err);
        alert("Order submission failed");
        this.isLoading.set(false); 
      }
      
    });
  }


  private createStripeSession() {
    const url = this.config.getApiUrl(this.ENDPOINTS.ORDERS_CREATE_CHECKOUT_SESSION);
    const deliveryFee = this.orderSummary()?.deliveryFee ?? 0;

    this.http.post<any>(url, { deliveryFee }).subscribe({
      next: (sessionRes) => {
        if (sessionRes?.url) {
          window.location.href = sessionRes.url;
        }
      },
      error: (err) => {
        console.error('Stripe session creation failed', err);
        alert("Failed to create Stripe session");
      }
    });
  }

}
