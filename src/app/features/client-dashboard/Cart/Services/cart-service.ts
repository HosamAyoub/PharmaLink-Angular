
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartSummary } from '../Interfaces/cart-summary';
import { CartUpdateDto } from '../Interfaces/cart-update-dto';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { CartItem } from '../Interfaces/cart-item';
import { AuthUtils } from '../../../../core/utils';
import { OrderSummary } from '../Interfaces/order-summary';
import { App } from '../../../../app';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  private CART_BASE = 'cart';

  constructor(private http: HttpClient, private config: ConfigService) { }

  getCartItems(): Observable<CartItem[]> {
    if (AuthUtils.isUserLoggedIn()) {
      // User is logged in - get from API
      const url = this.config.getApiUrl(`${this.CART_BASE}/items`);
      return this.http.get<CartItem[]>(url).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            console.warn('Cart not found on server, returning empty cart');
            // Clear any local cart data since it's stale
            localStorage.removeItem(APP_CONSTANTS.Cart);
            return new Observable<CartItem[]>(observer => {
              observer.next([]);
              observer.complete();
            });
          }
          return throwError(() => error);
        })
      );
    } else {
      // User is not logged in - get from local storage
      const cart = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');
      console.log('Loading cart from localStorage hhh:', cart);
      return new Observable<CartItem[]>(observer => {
        observer.next(cart);
        observer.complete();
      });
    }
  }

  getOrderSummary(): Observable<OrderSummary> 
  {
      const url = this.config.getApiUrl(APP_CONSTANTS.API.ENDPOINTS.ORDER_SUMMARY);
      return this.http.get<OrderSummary>(url);
    
  }

  addToCart(cartItem: CartItem): Observable<void> {
    //check if user is logged in
    if(AuthUtils.isUserLoggedIn()){
      const url = this.config.getApiUrl(`${this.CART_BASE}/AddToCart`);
      const dto: CartUpdateDto = {
        drugId: cartItem.drugId,
        pharmacyId: cartItem.pharmacyId,
        quantity: cartItem.quantity
      };
      return this.http.post<void>(url, dto);
    }
    else{
      let cart = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');

      //check that this item have the same pharmacy id in local storage
      const hasDifferentPharmacy = cart.find((item: CartItem) =>
         item.pharmacyId !== cartItem.pharmacyId
      );

      if(hasDifferentPharmacy) {
          return throwError(() => {
            const error = new Error('You can only add drugs from one pharmacy at a time.');
            (error as any).code = APP_CONSTANTS.ErrorCodes.DIFFERENT_PHARMACY;
            return error;
          }); 
        }

      const existingItemIndex = cart.findIndex((item: CartItem) => 
        item.drugId === cartItem.drugId && item.pharmacyId === cartItem.pharmacyId
      );
      
      if (existingItemIndex > -1) {
        // Update existing item
        cart[existingItemIndex].quantity += cartItem.quantity;
        cart[existingItemIndex].totalPrice = cart[existingItemIndex].unitPrice * cart[existingItemIndex].quantity;
      } else {
        // Add new item
        cart.push(cartItem);
      }
      
      localStorage.setItem(APP_CONSTANTS.Cart, JSON.stringify(cart));
      console.log('Added to localStorage cart:', cart);

      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }
  }

  incrementItem(dto: CartUpdateDto): Observable<void> {
    if(AuthUtils.isUserLoggedIn()) {
      const url = this.config.getApiUrl(`${this.CART_BASE}/plus`);
      return this.http.post<void>(url, dto);
    }
    else{
      let cartItems = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');
      const item = cartItems.find((x: CartItem) => x.drugId === dto.drugId && x.pharmacyId === dto.pharmacyId);
      if (item) {
        item.quantity += 1;
        item.totalPrice = item.unitPrice * item.quantity;
        localStorage.setItem(APP_CONSTANTS.Cart, JSON.stringify(cartItems));
        console.log('Incremented item in localStorage:', item);
      }
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }
  }

  decrementItem(dto: CartUpdateDto): Observable<void> {
    if(AuthUtils.isUserLoggedIn()) {
      const url = this.config.getApiUrl(`${this.CART_BASE}/minus`);
      return this.http.post<void>(url, dto);
    }
    else{
      let cartItems = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');
      const item = cartItems.find((x: CartItem) => x.drugId === dto.drugId && x.pharmacyId === dto.pharmacyId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice = item.unitPrice * item.quantity;
        localStorage.setItem(APP_CONSTANTS.Cart, JSON.stringify(cartItems));
        console.log('Decremented item in localStorage:', item);
      } else if (item && item.quantity === 1) {
        // Remove item if quantity becomes 0
        cartItems = cartItems.filter((x: CartItem) => !(x.drugId === dto.drugId && x.pharmacyId === dto.pharmacyId));
        localStorage.setItem(APP_CONSTANTS.Cart, JSON.stringify(cartItems));
        console.log('Removed item from localStorage:', item);
      }
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }
  }

  removeItemFromCart(dto: CartUpdateDto): Observable<void> {
    if(AuthUtils.isUserLoggedIn()) {
      const url = this.config.getApiUrl(`${this.CART_BASE}/remove`);
      return this.http.post<void>(url, dto);
    }
    else{
      let cartItems = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');
      cartItems = cartItems.filter((x: CartItem) => !(x.drugId === dto.drugId && x.pharmacyId === dto.pharmacyId));
      localStorage.setItem(APP_CONSTANTS.Cart, JSON.stringify(cartItems));
      console.log('Removed item from localStorage, remaining items:', cartItems);
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }
  }

  clearCart(): Observable<void> {
    if(AuthUtils.isUserLoggedIn()) {
      const url = this.config.getApiUrl(`${this.CART_BASE}/clear`);
      return this.http.post<void>(url, null);
    }
    else{
      localStorage.removeItem(APP_CONSTANTS.Cart);
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }
  }

  /**
   * Sync local storage cart with database after login
   * This merges local cart items with existing database cart
   */
  syncCartAfterLogin(): Observable<void> {
    const localCart: CartItem[] = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');
    
    if (localCart.length === 0) {
      console.log('No local cart items to sync');
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    
    // Convert local cart items to DTOs for bulk add
    const cartItemDtos = localCart.map((item: CartItem) => ({
      drugId: item.drugId,
      pharmacyId: item.pharmacyId,
      quantity: item.quantity
    }));

    // Use the bulk endpoint to add multiple items at once
    const url = this.config.getApiUrl(`${this.CART_BASE}/AddMultipleToCart`);
    
    return new Observable<void>(observer => {
      this.http.post<void>(url, cartItemDtos).subscribe({
        next: () => {
          // Clear local storage after successful sync
          localStorage.removeItem(APP_CONSTANTS.Cart);
          console.log('Cart sync completed successfully using bulk endpoint, local cart cleared');
          observer.next();
          observer.complete();
        },
        error: (error) => {
          console.error('Error syncing cart with bulk endpoint:', error);
          // Optionally keep local cart in case of sync failure
          observer.error(error);
        }
      });
    });
  }

}
