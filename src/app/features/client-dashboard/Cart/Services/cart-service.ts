
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartSummary } from '../Interfaces/cart-summary';
import { CartUpdateDto } from '../Interfaces/cart-update-dto';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { AuthService } from '../../../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  private CART_BASE = 'cart';
  userService = inject(AuthService)

  constructor(private http: HttpClient, private config: ConfigService) { }

  getCartSummary(): Observable<CartSummary> {
    const url = this.config.getApiUrl(`${this.CART_BASE}/summary`);
    return this.http.get<CartSummary>(url);
  }

  addToCart(dto: CartUpdateDto): Observable<void> {
    //check if user is logged in
    if(this.userService.user()){
      const url = this.config.getApiUrl(`${this.CART_BASE}/AddToCart`);
      return this.http.post<void>(url, dto);
    }
    else{
      let cart = JSON.parse(localStorage.getItem(APP_CONSTANTS.Cart) || '[]');

      const existingItemIndex = cart.findIndex((item: CartUpdateDto) => item.drugId === dto.drugId);
      if (existingItemIndex > -1) {
        // If item already exists, increment the quantity
        cart[existingItemIndex].quantity += dto.quantity;
      } else {
        // If item does not exist, add it to the cart
        cart.push(dto);
      }
      localStorage.setItem(APP_CONSTANTS.Cart, JSON.stringify(cart));
      // Return an observable to satisfy the return type
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });

    }
  }

  incrementItem(dto: CartUpdateDto) {
    const url = this.config.getApiUrl(`${this.CART_BASE}/plus`);
    return this.http.post(url, dto);
  }

  decrementItem(dto: CartUpdateDto) {
    const url = this.config.getApiUrl(`${this.CART_BASE}/minus`);
    return this.http.post(url, dto);
  }

  removeItemFromCart(dto: CartUpdateDto) {
    const url = this.config.getApiUrl(`${this.CART_BASE}/remove`);
    return this.http.post(url, dto);
  }

  clearCart() {
    const url = this.config.getApiUrl(`${this.CART_BASE}/clear`);
    return this.http.post(url, null);
  }
}
