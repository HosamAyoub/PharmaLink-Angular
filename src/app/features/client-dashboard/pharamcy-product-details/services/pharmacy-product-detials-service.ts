import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ipharmacy } from '../../shared/models/ipharmacy';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../shared/services/config.service';
import { IPharmaStock } from '../../Details/model/IPharmaDrug';

@Injectable({
  providedIn: 'root'
})
export class PharmacyProductDetialsService {
   http = inject(HttpClient);
   config = inject(ConfigService);

    // get nearest pharmacies
  getNearestPharmacies(lat: number, lng: number , drugId: number): Observable<IPharmaStock[]> {

    const params = { lat: lat.toString(), lng: lng.toString(), drugId: drugId.toString() };
    return this.http.get<IPharmaStock[]>(this.config.getApiUrl('PharmacyStock/GetNearestPharmacies'), { params });
  }

}
