import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPharmaDrug } from '../model/IPharmaDrug';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { IDrugDetails } from '../model/IDrugDetials';

@Injectable({
  providedIn: 'root'
})
export class DrugDetailsService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  constructor(private http: HttpClient, private config: ConfigService) {}

  getDrugById(DrugID: number): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.DRUG_BY_ID}?DrugID=${DrugID}`);
    return this.http.get<any>(url);
  }
}
