import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FavoriteDrug {
  drugId: number;
  name: string;
  description: string;
  imageUrl: string;
  drugCategory: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:5278/api/favorites'

  constructor(private http: HttpClient) { }

  getFavorites(): Observable<FavoriteDrug[]> {
    return this.http.get<FavoriteDrug[]>(this.apiUrl);
  }

  removeFromFavorites(drugId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${drugId}`);
  }

  clearFavorites(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ClearFavorites`);
  }
}
