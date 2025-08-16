import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { ConfigService } from '../../../../shared/services/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmaciesMangementService {

  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  constructor(private http: HttpClient, private config: ConfigService) { }
  /**
   * Fetches pharmacy analysis data from the API.
   * @returns An Observable containing the pharmacy analysis data.
   */
   suspendPharmacy(id: number): Observable<any> {
    const url = this.config.getFullApiUrl(`${this.ENDPOINTS.SUSPEND_PHARMACY}/${id}`);
    return this.http.put(url, {}, { responseType: 'text' }); 
  }

  confirmPharmacy(id: number): Observable<any> {
    const url = this.config.getFullApiUrl(`${this.ENDPOINTS.CONFIRM_PHARMACY}/${id}`);
    return this.http.put(url, {}, { responseType: 'text' }); 
  }
   rejectPharmacy(id: number): Observable<any> {
    const url = this.config.getFullApiUrl(`${this.ENDPOINTS.REJECT_PHARMACY}/${id}`);
    return this.http.put(url, {}, { responseType: 'text' }); 
  }
  changePharmacyUserRole(pharmacyId: number, newRoleName: string): Observable<any> {
    const url = this.config.getFullApiUrl(this.ENDPOINTS.CHANGE_ROLE);
    
    // Create properly formatted request body
    const body = {
        pharmacyId: pharmacyId,
        newRoleName: newRoleName
    };

    return this.http.put(url, JSON.stringify(body), { 
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        }),
        responseType: 'json' // Change back to json since backend returns JSON
    });
}
 
}
