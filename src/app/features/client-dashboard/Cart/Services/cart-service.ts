import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartSummary } from '../Interfaces/cart-summary';
import { CartUpdateDto } from '../Interfaces/cart-update-dto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:5278/api/cart';

  constructor(private http: HttpClient) { }
  getCartSummary(): Observable<CartSummary> {
    return this.http.get<CartSummary>(`${this.baseUrl}/summary`);
  }

  incrementItem(dto: CartUpdateDto) {
    return this.http.post(`${this.baseUrl}/plus`, dto);
  }

  decrementItem(dto: CartUpdateDto) {
    return this.http.post(`${this.baseUrl}/minus`, dto);
  }

  removeItemFromCart(dto: CartUpdateDto) {
    return this.http.post(`${this.baseUrl}/remove`, dto);
  }

  clearCart() {
    return this.http.post(`${this.baseUrl}/clear`, null);
  }
}
