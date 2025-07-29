import { Component, inject } from '@angular/core';
import { CartStore } from '../../Services/cart-store';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartItem } from '../../Interfaces/cart-item';
import { CartCard } from "../cart-card/cart-card";
import { CommonModule } from '@angular/common';
declare var bootstrap: any;
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

  clearCart(){
    if (this.cartItems().length === 0) {
      const modalElement = document.getElementById('emptyCartModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
      return;
    }
    this.cartStore.clearCart()
  }


  checkout() {
    if (this.cartItems().length === 0) {
      const modalElement = document.getElementById('emptyCartModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
      return;
    }

    const paymentMethod = (document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement)?.value;
    this.cartStore.checkout(paymentMethod);
  }

}
