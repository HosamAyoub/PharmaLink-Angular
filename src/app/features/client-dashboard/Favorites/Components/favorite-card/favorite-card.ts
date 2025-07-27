import { Component, EventEmitter, input, Output } from '@angular/core';
import { FavoriteDrug } from '../../Services/favorite-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-card',
  imports: [CommonModule],
  templateUrl: './favorite-card.html',
  styleUrl: './favorite-card.css'
})
export class FavoriteCard {
  drug = input<FavoriteDrug>(); 
  @Output() remove = new EventEmitter<number>();

  onRemoveClick() {
    this.remove.emit(this.drug()?.drugId);
  }
}
