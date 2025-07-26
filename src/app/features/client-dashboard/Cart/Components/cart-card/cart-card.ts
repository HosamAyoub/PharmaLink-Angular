import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cart-card',
  imports: [],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css'
})
export class CartCard {
  @Input() item: any;
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}
