import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { CartItem } from '../../Interfaces/cart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-card',
  imports: [CommonModule],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css'
})
export class CartCard {
  item = input<CartItem>();

  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}
