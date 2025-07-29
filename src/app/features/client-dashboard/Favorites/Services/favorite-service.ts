import { HttpClient } from '@angular/common/http';
import {effect, Injectable } from '@angular/core';
import { IFavDrug } from '../../../../core/drug/IFavDrug';
import { signal } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:5278/api/favorites';
  public favoriteDrugs = signal<IFavDrug[]>([]);

  constructor(private http: HttpClient) {
    effect(() => {
      this.getFavorites();
    });
  }

  getFavorites(){
     this.http.get<IFavDrug[]>(this.apiUrl).subscribe(data => 
    {
      this.favoriteDrugs.set(data);
      console.log('Favorites updated:', this.favoriteDrugs());
    });
  }

  addToFavorites(drugId: number) 
  {
    this.http.post(`${this.apiUrl}`, { drugId }).subscribe(() => {
      this.getFavorites();
    });
  }


  removeFromFavorites(drugId: number) {
    this.http.delete(`${this.apiUrl}/${drugId}`).subscribe(() => {
      this.getFavorites();
    });

}


 clearFavorites(callback?: () => void) 
 {
  this.http.delete(`${this.apiUrl}/ClearFavorites`).subscribe(() => {
    this.getFavorites();
  });
 }


 isFavorite(drugId: number): boolean 
{
  if (!Array.isArray(this.favoriteDrugs())) return false;
  return this.favoriteDrugs().some(d => d.drugId === drugId);
}

  
  ToggleFavorites(drugId: number) 
  {
    if(this.isFavorite(drugId))
    {
      console.log('Removing from favorites:', drugId);
      this.removeFromFavorites(drugId);
    } else {
      console.log('Adding to favorites:', drugId);
      this.addToFavorites(drugId);
    }
  }
}

