import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ipharmacy } from '../../shared/models/ipharmacy';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PharmacyProductsService {
  http = inject(HttpClient);
  configService = inject(ConfigService);
  getPharmacyProduct(id: number): Observable<Ipharmacy> {
    let url = this.configService.getFullApiUrl('PHARMACY');
    return this.http.get<Ipharmacy>(`${url}/${id}`);
  }
}
