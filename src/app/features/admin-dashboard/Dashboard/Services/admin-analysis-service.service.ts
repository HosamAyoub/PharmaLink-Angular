import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../shared/services/config.service';
import { IPharmacyAnalysis } from '../../../pharmacy-dashboard/Dashboard/Interface/pharmacy-analysis-interface';
import { Observable } from 'rxjs';
import { AdminAnalysisInterface } from '../Interface/admin-analysis-interface';

@Injectable({
  providedIn: 'root'
})
export class AdminAnalysisServiceService {

  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  
    constructor(private http: HttpClient, private config: ConfigService) {}
    /**
     * Fetches pharmacy analysis data from the API.
     * @returns An Observable containing the pharmacy analysis data.
     */
    getAdminAnalysis(): Observable<IPharmacyAnalysis> {
      const url = this.config.getFullApiUrl(this.ENDPOINTS.ADMIN_ANALYSIS);
      return this.http.get<IPharmacyAnalysis>(url);
    }
    getPharmaciesSummary(): Observable<AdminAnalysisInterface>{
      const url = this.config.getFullApiUrl(this.ENDPOINTS.PHARMACIES_SUMMARY)
      return this.http.get<AdminAnalysisInterface>(url);
    }
  
}
