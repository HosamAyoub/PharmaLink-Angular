import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFavDrug } from '../../../../../core/drug/IFavDrug';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorite-card',
  imports: [CommonModule, RouterLink],
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
