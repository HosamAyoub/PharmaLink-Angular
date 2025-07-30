import { inject, Injectable, signal } from '@angular/core';
import { CartItem } from '../Interfaces/cart-item';
import { OrderSummary } from '../Interfaces/order-summary';
import { CartService } from './cart-service';
import { CartUpdateDto } from '../Interfaces/cart-update-dto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubmitOrderRequest } from '../Interfaces/submit-order-request';


@Injectable({
  providedIn: 'root'
})
export class CartStore {
  // Signals
  cartItems = signal<CartItem[]>([]);
  orderSummary = signal<OrderSummary | null>(null);

  http = inject(HttpClient);
  router = inject(Router);


  constructor(private cartService: CartService) { }

  // Load cart summary from API
  loadCart() {
    this.cartService.getCartSummary().subscribe({
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
        next: () => this.updateTotals(),
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
        next: () => this.updateTotals(),
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

  clearCart() {
    this.cartService.clearCart().subscribe({
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

  checkout(paymentMethod: string) {
    const orderRequest: SubmitOrderRequest = {
      items: this.cartItems().map(item => ({
        drugId: item.drugId,
        pharmacyId: item.pharmacyId,
        quantity: item.quantity
      }))
    };

    this.http.post<any>('http://localhost:5278/api/Orders/submit', { paymentMethod }).subscribe({
      next: (res) => {
        if (paymentMethod === 'cash') {
          this.router.navigate(['/client/success'], { queryParams: { orderId: res.orderId } });
        } else {
          this.createStripeSession(res.orderId);
        }
      },
      error: (err) => {
        console.error('Order submission failed', err);
        alert("Order submission failed");
      }
    });
  }

  private createStripeSession(orderId: number) {
    this.http.post<any>('http://localhost:5278/api/Orders/CreateCheckoutSession', orderId).subscribe({
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
