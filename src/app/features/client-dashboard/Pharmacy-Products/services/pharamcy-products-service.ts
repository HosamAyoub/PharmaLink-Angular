import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ipharmacy } from '../../shared/models/ipharmacy';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PharmacyProductsService {
  http = inject(HttpClient);
  configService = inject(ConfigService);
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  getPharmacy(id: number): Observable<Ipharmacy> {
    const url = this.configService.getFullApiUrl(this.ENDPOINTS.PHARMACY);
    return this.http.get<Ipharmacy>(`${url}/${id}`);
  }
getPharmacyProducts(pharmacyId: number, pageNumber: number, pageSize: number): Observable<any> {
    const url = this.configService.getFullApiUrl(this.ENDPOINTS.Bath);
    var params = { pharmacyId: pharmacyId , pageNumber: pageNumber, pageSize: pageSize};
    return this.http.get<any>(url, { params });
  }

  getPharmacyProductsByCategory(pharmacyId: number, categoryName: string, pageNumber: number, pageSize: number): Observable<any> {
    const url = this.configService.getFullApiUrl(`${this.ENDPOINTS.PHARMACY_STOCK}/${categoryName}`);
    var params = { pharmacyId: pharmacyId,pageNumber: pageNumber, pageSize: pageSize };
    return this.http.get<any>(url, { params });
  }
}
