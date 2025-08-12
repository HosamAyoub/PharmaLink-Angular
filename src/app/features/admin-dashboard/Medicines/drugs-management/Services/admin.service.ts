import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ConfigService } from '../../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../../shared/constants/app.constants';
import { IDrugDetails } from '../../../../client-dashboard/Details/model/IDrugDetials';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  DrugsList = signal<IDrugDetails[]>([]);
  constructor(private http: HttpClient, private config: ConfigService) {

  }

  getDrugStatistics() {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.DRUG_ADMINDATA}`);
    return this.http.get<any>(url);
  }

}
