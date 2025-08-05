import { IPharmacyAnalysis, IPharmacystockAnalysis } from './../Interface/pharmacy-analysis-interface';
import { ConfigService } from './../../../../shared/services/config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmacyAnalysisService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  constructor(private http: HttpClient, private config: ConfigService) {}
  /**
   * Fetches pharmacy analysis data from the API.
   * @returns An Observable containing the pharmacy analysis data.
   */
  getPharmacyAnalysis(): Observable<IPharmacyAnalysis> {
    const url = this.config.getFullApiUrl(this.ENDPOINTS.PHARMACY_ANALYSIS);
    return this.http.get<IPharmacyAnalysis>(url);
  }

  getPharmacyStockAnalysis(): Observable<IPharmacystockAnalysis> {
    const url = this.config.getFullApiUrl(this.ENDPOINTS.PHARMACY_STOCK_ANALYSIS);
    return this.http.get<IPharmacystockAnalysis>(url);
  }
}
