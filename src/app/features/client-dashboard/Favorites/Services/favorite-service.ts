
import { HttpClient } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { IDrug } from '../../Categories_Page/models/IDrug';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';



@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  public favoriteDrugs = signal<IDrug[]>([]);

  constructor(private http: HttpClient, private config: ConfigService) {
    effect(() => {
      this.getFavorites();
    });
  }

  getFavorites() {
    const url = this.config.getApiUrl(this.ENDPOINTS.FAVORITES);
    this.http.get<IDrug[]>(url).subscribe(data => {
      if (Array.isArray(data)) {
        this.favoriteDrugs.set(data);
      } else {
        this.favoriteDrugs.set([]);
      }
      console.log('Favorites updated:', this.favoriteDrugs());
    });
  }

  addToFavorites(drugId: number) {
    const url = this.config.getApiUrl(this.ENDPOINTS.FAVORITES);
    this.http.post(url, { drugId }).subscribe(() => {
      this.getFavorites();
    });
  }

  removeFromFavorites(drugId: number) {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.FAVORITES}/${drugId}`);
    this.http.delete(url).subscribe(() => {
      this.getFavorites();
    });
  }

  clearFavorites() {
    this.http.delete(`${this.ENDPOINTS.FAVORITES}/ClearFavorites`).subscribe(() => {
      this.getFavorites();
    });
  }

  isFavorite(drugId: number): boolean {
    if (!Array.isArray(this.favoriteDrugs())) return false;
    return this.favoriteDrugs().some(d => d.drugId === drugId);
  }

  ToggleFavorites(drugId: number) {
    if (this.isFavorite(drugId)) {
      console.log('Removing from favorites:', drugId);
      this.removeFromFavorites(drugId);
    } else {
      console.log('Adding to favorites:', drugId);
      this.addToFavorites(drugId);
    }
  }
}

