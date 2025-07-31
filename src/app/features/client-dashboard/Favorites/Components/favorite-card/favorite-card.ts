import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IDrug } from '../../../Categories_Page/models/IDrug';

@Component({
  selector: 'app-favorite-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorite-card.html',
  styleUrl: './favorite-card.css'
})
export class FavoriteCard {
  drug = input<IDrug>();

  @Output() remove = new EventEmitter<number>();
  onRemoveClick()
  {
    this.remove.emit(this.drug()?.drugId);
  }
}
