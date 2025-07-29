import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ipharmacy } from '../../shared/models/ipharmacy';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private PharmacyDomain = 'http://localhost:5278'
  private PharmacyApi = this.PharmacyDomain +'/api/Pharmacy';

  constructor(private http: HttpClient) { }

  // get all pharmacies
  getPharmacies() : Observable<Ipharmacy[]> {
    return this.http.get<Ipharmacy[]>(this.PharmacyApi);
  }
  // get pharmacy by id
  getPharmacyById(id: number): Observable<Ipharmacy> {
    return this.http.get<Ipharmacy>(`${this.PharmacyApi}/${id}`);
  }
  // get pharmacies by name
  getPharmaciesByName(name: string): Observable<Ipharmacy[]> {
    return this.http.get<Ipharmacy[]>(`${this.PharmacyApi}/search/${name}`);
  }
  // get pharmacy by name
  getPharmacyByName(name: string): Observable<Ipharmacy> {
    return this.http.get<Ipharmacy>(`${this.PharmacyApi}/search/${name}`);
  }
  // update pharmacy
  updatePharmacy(id: number, pharmacy: Ipharmacy): Observable<Ipharmacy> {
    return this.http.put<Ipharmacy>(`${this.PharmacyApi}/${id}`, pharmacy);
  }
  // delete pharmacy
  deletePharmacy(id: number): Observable<Ipharmacy> {
    return this.http.delete<Ipharmacy>(`${this.PharmacyApi}/${id}`);
  }
}
