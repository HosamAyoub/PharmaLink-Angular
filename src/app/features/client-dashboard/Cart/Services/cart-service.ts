
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartSummary } from '../Interfaces/cart-summary';
import { CartUpdateDto } from '../Interfaces/cart-update-dto';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  private CART_BASE = 'cart';

  constructor(private http: HttpClient, private config: ConfigService) { }

  getCartSummary(): Observable<CartSummary> {
    const url = this.config.getApiUrl(`${this.CART_BASE}/summary`);
    return this.http.get<CartSummary>(url);
  }

  addToCart(dto: CartUpdateDto): Observable<void> {
    const url = this.config.getApiUrl(`${this.CART_BASE}/AddToCart`);
    return this.http.post<void>(url, dto);
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
