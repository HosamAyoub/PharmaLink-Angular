import { Component, inject, signal } from '@angular/core';
import { FavoriteService } from '../../Services/favorite-service';
import { FavoriteCard } from '../favorite-card/favorite-card';
import { CommonModule } from '@angular/common';
import { computed } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-favorite-page',
  imports: [CommonModule, FavoriteCard],
  templateUrl: './favorite-page.html',
  styleUrl: './favorite-page.css'
})
export class FavoritePage 
{
  private favoriteService = inject(FavoriteService);

  favoriteDrugs = computed(() => this.favoriteService.favoriteDrugs());

  ngOnInit() 
  {
    this.favoriteService.getFavorites();
  }

  onRemove(drugId: number) 
  {
    this.favoriteService.removeFromFavorites(drugId);
  }

  onClear() {
    if (this.favoriteDrugs().length === 0) {
    const modalElement = document.getElementById('emptyFavoritesModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
    return;
  }
    this.favoriteService.clearFavorites();
  }

}
