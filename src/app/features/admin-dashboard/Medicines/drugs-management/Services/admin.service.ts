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

  deleteDrug(drugId: number) {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.DRUG_BY_ID}/${drugId}`);
    return this.http.delete(url);
  }

  updateDrug(drugData: IDrugDetails) {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.DRUG_BY_ID}`);
    console.log('Updating drug:', drugData);
    return this.http.put(url, drugData);
  }

  saveNewDrug(drugData: IDrugDetails) {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.DRUG_BY_ID}`);
    return this.http.post(url, drugData);
  }

  getActivePharmacies() {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY_ACTIVE}`);
    return this.http.get<any>(url);
  }

}
