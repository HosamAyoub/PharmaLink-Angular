import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPharmaDrug } from './IPharmaDrug';
import { IFavDrug } from './IFavDrug';

@Injectable({
  providedIn: 'root',
})
export class DrugService {
  constructor(private http: HttpClient) {}

  getDrugsByCategory(categoryName: string): Observable<IFavDrug[]> {
    return this.http.get<IFavDrug[]>(
      `http://localhost:5278/api/Drug/Category?Cname=${categoryName}`
    );
  }

  getRandomDrugs(): Observable<IFavDrug[]> {
    return this.http.get<IFavDrug[]>(`http://localhost:5278/api/Drug/2`);
  }

  getDrugById(DrugID: number): Observable<IPharmaDrug> {
    return this.http.get<IPharmaDrug>(
      `http://localhost:5278/api/Drug?DrugID=${DrugID}`
    );
  }

}
