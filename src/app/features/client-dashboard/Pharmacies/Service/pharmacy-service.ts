
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ipharmacy } from '../../shared/models/ipharmacy';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { ConfigService } from '../../../../shared/services/config.service';
import { PharmacyDisplayDTO } from '../../../pharmacy-dashboard/profile/Interfaces/pharmacy-display-dto';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  config = inject(ConfigService);

  constructor(private http: HttpClient) { }

  // get all pharmacies
  getActivePharmacies(): Observable<Ipharmacy[]> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY_STATUS}/${1}`);
    return this.http.get<Ipharmacy[]>(url);
  }
  getPendingPharmacies(): Observable<Ipharmacy[]> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY_STATUS}/${2}`);
    return this.http.get<Ipharmacy[]>(url);
  }
  getSuspendedPharmacies(): Observable<Ipharmacy[]> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY_STATUS}/${0}`);
    return this.http.get<Ipharmacy[]>(url);
  }
   getRejectedPharmacies(): Observable<Ipharmacy[]> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY_STATUS}/${3}`);
    return this.http.get<Ipharmacy[]>(url);
  }
  // get pharmacy by id
  getPharmacyById(id: number): Observable<Ipharmacy> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY}/${id}`);
    return this.http.get<Ipharmacy>(url);
  }

  // get pharmacies by name
  getPharmaciesByName(name: string): Observable<Ipharmacy[]> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY}/search/${name}`);
    return this.http.get<Ipharmacy[]>(url);
  }

  // get pharmacy by name
  getPharmacyByName(name: string): Observable<Ipharmacy> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY}/search/${name}`);
    return this.http.get<Ipharmacy>(url);
  }

  // update pharmacy
  updatePharmacy(id: number, pharmacy: Ipharmacy): Observable<Ipharmacy> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY}/${id}`);
    return this.http.put<Ipharmacy>(url, pharmacy);
  }

  // delete pharmacy
  deletePharmacy(id: number): Observable<Ipharmacy> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY}/${id}`);
    return this.http.delete<Ipharmacy>(url);
  }


}
