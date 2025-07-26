import { Component, inject, signal } from '@angular/core';
import { FavoriteDrug, FavoriteService } from '../../Services/favorite-service';
import { FavoriteCard } from '../favorite-card/favorite-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-page',
  imports: [CommonModule, FavoriteCard],
  templateUrl: './favorite-page.html',
  styleUrl: './favorite-page.css'
})
export class FavoritePage {
  private favoriteService = inject(FavoriteService);

  favoriteDrugs = signal<FavoriteDrug[]>([]);

  ngOnInit() {
    this.favoriteService.getFavorites().subscribe((data) => {
      this.favoriteDrugs.set(data);
    });
  }

  onRemove(drugId: number) {
    this.favoriteService.removeFromFavorites(drugId).subscribe(() => {
      this.favoriteDrugs.set(this.favoriteDrugs().filter(d => d.drugId !== drugId));
    });
  }

  onClear() {
    this.favoriteService.clearFavorites().subscribe(() => {
      this.favoriteDrugs.set([]);
    });
  }
}
