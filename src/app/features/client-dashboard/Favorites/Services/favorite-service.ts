
import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { IDrug } from '../../Categories_Page/models/IDrug';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { AuthUtils } from '../../../../core/utils';
import { Observable } from 'rxjs';



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
    if(AuthUtils.isUserLoggedIn()) {
    const url = this.config.getApiUrl(this.ENDPOINTS.FAVORITES);
    this.http.get<IDrug[]>(url).subscribe(data => {
      if (Array.isArray(data)) {
        this.favoriteDrugs.set(data);
      } else {
        this.favoriteDrugs.set([]);
      }
    });
  }
  else{
    const favorites = localStorage.getItem(APP_CONSTANTS.Favorites) || '[]';
    const favoritesArray = JSON.parse(favorites);
    this.favoriteDrugs.set(favoritesArray.map((drug: IDrug) => ({
      drugId: drug.drugId,
      name: drug.name,
      description: drug.description,
      imageUrl: drug.imageUrl,
      drugCategory: drug.drugCategory
    })));
  }
  
}

  addToFavorites(drug: IDrug) {
    if(AuthUtils.isUserLoggedIn()) {
    const url = this.config.getApiUrl(this.ENDPOINTS.FAVORITES);
    this.http.post(url, { drugId: drug.drugId }).subscribe(() => {
      this.getFavorites();
    });
  }
  else{
    const favorites = localStorage.getItem(APP_CONSTANTS.Favorites)||'[]';
    const favoritesArray = JSON.parse(favorites);
    favoritesArray.push(drug);
    localStorage.setItem(APP_CONSTANTS.Favorites, JSON.stringify(favoritesArray));
    // Update the signal to trigger reactivity
    this.getFavorites();
  }
  
}

  removeFromFavorites(drugId: number) {
    if(AuthUtils.isUserLoggedIn()) {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.FAVORITES}/${drugId}`);
    this.http.delete(url).subscribe(() => {
      this.getFavorites();
    });
  }
  else{
    const favorites = localStorage.getItem(APP_CONSTANTS.Favorites)||'[]';
    const favoritesArray = JSON.parse(favorites);
    const updatedFavorites = favoritesArray.filter((drug: IDrug) => drug.drugId !== drugId);
    localStorage.setItem(APP_CONSTANTS.Favorites, JSON.stringify(updatedFavorites));
    // Update the signal to trigger reactivity
    this.getFavorites();
  }
  
}

  clearFavorites() {
  const url = this.config.getApiUrl(`${this.ENDPOINTS.FAVORITES}/ClearFavorites`);
  this.http.delete(url).subscribe({
    next: () => this.getFavorites(),
    error: err => console.error('Clear Favorites failed:', err)
  });
}


  isFavorite(drugId: number): boolean {
    if (!Array.isArray(this.favoriteDrugs())) return false;
    return this.favoriteDrugs().some(d => d.drugId === drugId);
  }

  ToggleFavorites(drug: IDrug) {
    if (this.isFavorite(drug.drugId)) {
      this.removeFromFavorites(drug.drugId);
    } else {
      this.addToFavorites(drug);
    }
  }

  syncFavoritesAfterLogin() : Observable<void> {
    const favorites = localStorage.getItem(APP_CONSTANTS.Favorites) || '[]';
    const favoritesArray = JSON.parse(favorites).map((drug: IDrug) => drug.drugId);
    
    if (favoritesArray.length === 0) {
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    const url = this.config.getApiUrl(this.ENDPOINTS.MULTIPLE_FAVORITES);
    return new Observable<void>(observer => {
      this.http.post<void>(url, favoritesArray).subscribe({
        next: () => {
          this.getFavorites();
          observer.next();
          observer.complete();
        },
        error: err => {
          observer.error(err);
        },
        complete: () => {
        }
      });
    });
  }
}


        
 
