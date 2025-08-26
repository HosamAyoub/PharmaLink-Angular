import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { ConfigService } from '../../../../shared/services/config.service';
import { Observable } from 'rxjs';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { IUsersDisplay } from '../Interface/users-display';

@Injectable({
  providedIn: 'root'
})
export class UserDisplayServiceService {

  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  constructor(private http: HttpClient, private config: ConfigService) { }



  changeUserRole(userId: string, newRoleName: string): Observable<any> {
      const url = this.config.getFullApiUrl(this.ENDPOINTS.CHANGE_ROLE_ID);
      
      // Create properly formatted request body
      const body = {
          UserId: userId,
          RoleName: newRoleName
      };
      console.log('Change Role Request Body:', body); // Debug log
  
      return this.http.put(url, JSON.stringify(body), { 
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          }),
          responseType: 'json' // Change back to json since backend returns JSON
      });
    }
   getAllPatients(): Observable<IUsersDisplay[]> {
      const url = this.config.getFullApiUrl(this.ENDPOINTS.PATIENTS_DATA);
      return this.http.get<IUsersDisplay[]>(url);
    }
  suspendPatient(id: number): Observable<any> {
    const url = this.config.getFullApiUrl(`${this.ENDPOINTS.SUSPEND_USER}/${id}`);
    return this.http.put(url, {}, { responseType: 'text' }); 
  }
  activatePatient(id: number): Observable<any> {
    const url = this.config.getFullApiUrl(`${this.ENDPOINTS.CONFIRM_USER}/${id}`);
    return this.http.put(url, {}, { responseType: 'text' }); 
  }
}
