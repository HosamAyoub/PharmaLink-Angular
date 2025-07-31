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

  getPharmacyProduct(id: number): Observable<Ipharmacy> {
    const url = this.configService.getFullApiUrl(this.ENDPOINTS.PHARMACY);
    return this.http.get<Ipharmacy>(`${url}/${id}`);
  }
}
