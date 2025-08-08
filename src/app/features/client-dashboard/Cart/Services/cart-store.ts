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
import { User } from '../../../../shared/models/user.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthUtils } from '../../../../core/utils';

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
  toastService = inject(ToastService);


  constructor(private cartService: CartService, private http: HttpClient, private router: Router, private config: ConfigService) { 
    // Initialize cart on service creation
    this.loadCart();
  }

  // Load cart data from API or local storage
  loadCart(): Subscription | undefined {
    // Always use getCartItems since we don't have getCartSummary
    return this.cartService.getCartItems().subscribe({
      next: (data: CartItem[]) => {
        this.cartItems.set(data);
        // get summery 
        
        // Calculate totals manually for both authenticated and non-authenticated users
        this.calculateTotals();
      },
      error: (err: any) => {
        console.error('Failed to load cart:', err);
        // Clear cart items from UI if there's an error (like 404)
        this.cartItems.set([]);
        // Reset financial totals only, keep user info if it exists
        const currentSummary = this.orderSummary();
        if (currentSummary) {
          this.orderSummary.set({
            ...currentSummary,
            subtotal: 0,
            total: currentSummary.deliveryFee
          });
        }
      }
    });
  }

  getOrderSummary(): Subscription | undefined {
    return this.cartService.getOrderSummary().subscribe({
      next: (summary: OrderSummary) => {
        this.orderSummary.set(summary);
      },
      error: (err: any) => {
        console.error('Failed to load order summary:', err);
        this.orderSummary.set(null); // Clear summary on error
      }
    });
  }
  

 
  // Calculate totals for cart items
  private calculateTotals() {
    const items = this.cartItems();
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const deliveryFee = 15; // Default delivery fee
    const total = subtotal + deliveryFee;

    // Create a complete OrderSummary object
    const orderSummary: OrderSummary = {
      name: '',
      phoneNumber: '',
      email: '',
      address: '',
      country: '',
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total
    };

    this.orderSummary.set(orderSummary);
  }

  /**
   * Sync local storage cart with database after login
   * Call this method when user successfully logs in
   */
  syncCartAfterLogin(): void {
     
    this.cartService.syncCartAfterLogin().subscribe({
      next: () => {
        // Reload cart from database after sync
        this.loadCart();
      },
      error: (error) => {
        this.toastService.showError('Failed to sync cart items. Please try again.');
        console.error('Cart sync failed:', error);
      }
    });
  }



  /**
   * Check if user has items in local storage
   * Useful for showing merge prompts to users
   */
  hasLocalCartItems(): boolean {
    const localCart = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');
    return localCart.length > 0;
  }

  /**
   * Get count of local cart items
   */
  getLocalCartItemsCount(): number {
    const localCart = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');
    return localCart.length;
  }

  /**
   * Add item to cart and refresh the store
   * This is the preferred method for adding items to cart as it updates the UI automatically
   */
  addToCart(cartItem: CartItem): Observable<void> {
    return new Observable<void>(observer => {
      this.cartService.addToCart(cartItem).subscribe({
        next: () => {
          // Reload cart data to refresh the UI
          this.loadCart();
          observer.next();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
  
  // Actions
  increment(item: CartItem) {
    const dto: CartUpdateDto = {
      drugId: item.drugId,
      pharmacyId: item.pharmacyId,
      quantity: 1 // Always increment by 1
    };
      this.cartService.incrementItem(dto).subscribe({
        next: () => this.loadCart(),
        error: (err: any) => console.error('Increment error:', err)
      });
    }

  decrement(item: CartItem) {
    const dto: CartUpdateDto = {
      drugId: item.drugId,
      pharmacyId: item.pharmacyId,
      quantity: 1 // Always decrement by 1
    };

      if (item.quantity === 1) {
        // Remove item if quantity becomes 0
        this.remove(item);
      } else {
        this.cartService.decrementItem(dto).subscribe({
          next: () => this.loadCart(),
          error: (err: any) => console.error('Decrement error:', err)
        });
      }
  }


  remove(item: CartItem) {
    const dto: CartUpdateDto = {
      drugId: item.drugId,
      pharmacyId: item.pharmacyId,
      quantity: item.quantity
    };

    if (AuthUtils.isUserLoggedIn()) {
      this.cartService.removeItemFromCart(dto).subscribe({
        next: () => {
          this.loadCart(); // Reload from server
        },
        error: (err: any) => {
          console.error('Remove error:', err);
          // If cart not found (404), reload cart which will clear UI
          if (err.status === 404) {
            this.loadCart(); // This will clear the cart items from UI
          }
        }
      });
    } else {
      // Handle local storage
      let cartItems = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');
      cartItems = cartItems.filter((x: CartUpdateDto) => !(x.drugId === dto.drugId && x.pharmacyId === dto.pharmacyId));
      localStorage.setItem(APP_CONSTANTS.Cart, JSON.stringify(cartItems));
      this.loadCart(); // Refresh the cart display
    }
  }

  clearCart(): Subscription | undefined {
    if (AuthUtils.isUserLoggedIn()) {
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
        error: (err: any) => {
          console.error('Clear cart failed', err);
          // If cart not found (404), clear UI anyway
          if (err.status === 404) {
            this.clearCartUI();
          }
        }
      });
    } else {
      // Handle local storage
      localStorage.removeItem(APP_CONSTANTS.Cart);
      this.cartItems.set([]);
      const summary = this.orderSummary();
      if (summary) {
        summary.subtotal = 0;
        summary.total = summary.deliveryFee;
        this.orderSummary.set({ ...summary });
      }
      return undefined;
    }
  }

  /**
   * Clear cart items from UI (useful when backend returns 404)
   */
  clearCartUI(): void {
    this.cartItems.set([]);
    const summary = this.orderSummary();
    if (summary) {
      this.orderSummary.set({
        ...summary,
        subtotal: 0,
        total: summary.deliveryFee
      });
    }
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
