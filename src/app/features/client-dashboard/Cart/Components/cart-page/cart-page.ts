import { Component, inject } from '@angular/core';
import { CartStore } from '../../Services/cart-store';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartItem } from '../../Interfaces/cart-item';
import { CartCard } from "../cart-card/cart-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  imports: [CartCard, CommonModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage {
  cartStore = inject(CartStore);
  cartItems = this.cartStore.cartItems;
  orderSummary = this.cartStore.orderSummary;
  http = inject(HttpClient);
  router = inject(Router);

   ngOnInit(): void {
    this.cartStore.loadCart();
  }

  getTotalPrice(item: CartItem): number {
    return item.unitPrice * item.quantity;
  }

  onIncrement(item: CartItem) {
    this.cartStore.increment(item);
  }

  onDecrement(item: CartItem) {
    this.cartStore.decrement(item);
  }

  removeItem(item: CartItem) {
    this.cartStore.remove(item);
  }


  checkout() {
    const paymentMethod = (document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement)?.value;
    this.cartStore.checkout(paymentMethod);
  }

}
