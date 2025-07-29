import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFavDrug } from '../../../../../core/drug/IFavDrug';

@Component({
  selector: 'app-favorite-card',
  imports: [CommonModule],
  templateUrl: './favorite-card.html',
  styleUrl: './favorite-card.css'
})
export class FavoriteCard {
  drug = input<IFavDrug>(); 
  
  @Output() remove = new EventEmitter<number>();
  onRemoveClick() 
  {
    this.remove.emit(this.drug()?.drugId);
  }
}
