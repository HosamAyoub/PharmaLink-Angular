import { Injectable } from '@angular/core';
import { IDrug } from './IDrug';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPharmaDrug } from './IPharmaDrug';

@Injectable({
  providedIn: 'root'
})
export class DrugService 
{
  constructor(private http: HttpClient) {}

  getDrugsByCategory(categoryName: string): Observable<IDrug[]> {
    return this.http.get<IDrug[]>(`http://localhost:5278/api/Drug/Category?Cname=${categoryName}`);
  }

  getRandomDrugs(): Observable<IDrug[]> 
  {
    return this.http.get<IDrug[]>(`http://localhost:5278/api/Drug/2`);
  }

  getDrugById(DrugID : number):Observable<IPharmaDrug>
  {
    return  this.http.get<IPharmaDrug>(`http://localhost:5278/api/Drug?DrugID=${DrugID}`);
  }
  
}
