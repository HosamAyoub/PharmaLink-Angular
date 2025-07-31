
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDrug } from '../models/IDrug';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class DrugService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  constructor(private http: HttpClient, private config: ConfigService) {}

  getDrugsByCategory(categoryName: string): Observable<IDrug[]> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.DRUG_CATEGORY}?Cname=${categoryName}`);
    return this.http.get<IDrug[]>(url);
  }

  getRandomDrugs(): Observable<IDrug[]> {
    const url = this.config.getApiUrl(this.ENDPOINTS.DRUG_RANDOM);
    return this.http.get<IDrug[]>(url);
  }


}
