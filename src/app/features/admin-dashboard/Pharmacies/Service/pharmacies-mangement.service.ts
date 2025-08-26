import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { ConfigService } from '../../../../shared/services/config.service';

export interface PharmacyStateUpdate {
  pharmacyId: number;
  oldStatus: number;
  newStatus: number;
}

@Injectable({
  providedIn: 'root'
})
export class PharmaciesMangementService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  
  
  // Signal to track pharmacy state changes
  private pharmacyStateChanges = signal<PharmacyStateUpdate[]>([]);
  
  // Expose read-only signal
  public readonly pharmacyUpdates = this.pharmacyStateChanges.asReadonly();

  constructor(private http: HttpClient, private config: ConfigService) { }

  
   //Suspends a pharmacy and updates the local state
   
  suspendPharmacy(id: number): Observable<any> {
    const url = this.config.getFullApiUrl(`${this.ENDPOINTS.SUSPEND_PHARMACY}/${id}`);
    return this.http.put(url, {}, { responseType: 'text' }).pipe(
      tap(() => {
        // Update the signal to notify components of the change
        this.updatePharmacyState(id, -1, 0); // -1 indicates unknown old status, 0 is suspended
      })
    );
  }

    // Confirms/activates a pharmacy and updates the local state
   
  confirmPharmacy(id: number): Observable<any> {
    const url = this.config.getFullApiUrl(`${this.ENDPOINTS.CONFIRM_PHARMACY}/${id}`);
    return this.http.put(url, {}, { responseType: 'text' }).pipe(
      tap(() => {
        // Update the signal to notify components of the change
        this.updatePharmacyState(id, -1, 1); // -1 indicates unknown old status, 1 is active
      })
    );
  }

  
    // Rejects a pharmacy and updates the local state
   
  rejectPharmacy(id: number): Observable<any> {
    const url = this.config.getFullApiUrl(`${this.ENDPOINTS.REJECT_PHARMACY}/${id}`);
    return this.http.put(url, {}, { responseType: 'text' }).pipe(
      tap(() => {
        // Update the signal to notify components of the change
        this.updatePharmacyState(id, -1, 3); // -1 indicates unknown old status, 3 is rejected
      })
    );
  }

  /**
   * Changes pharmacy user role
   */
  changePharmacyUserRole(pharmacyId: number, newRoleName: string): Observable<any> {
    const url = this.config.getFullApiUrl(this.ENDPOINTS.CHANGE_ROLE);
    
    const body = {
      pharmacyId: pharmacyId,
      newRoleName: newRoleName
    };

    return this.http.put(url, JSON.stringify(body), { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'json'
    });
  }

  /**
   * Updates the pharmacy state signal
   */
  private updatePharmacyState(pharmacyId: number, oldStatus: number, newStatus: number): void {
    const currentUpdates = this.pharmacyStateChanges();
    const existingUpdateIndex = currentUpdates.findIndex(update => update.pharmacyId === pharmacyId);
    
    if (existingUpdateIndex >= 0) {
      // Update existing entry
      const updatedArray = [...currentUpdates];
      updatedArray[existingUpdateIndex] = { pharmacyId, oldStatus, newStatus };
      this.pharmacyStateChanges.set(updatedArray);
    } else {
      // Add new entry
      this.pharmacyStateChanges.set([...currentUpdates, { pharmacyId, oldStatus, newStatus }]);
    }
  }

  /**
   * Clear a specific pharmacy update from the signal
   */
  clearPharmacyUpdate(pharmacyId: number): void {
    const currentUpdates = this.pharmacyStateChanges();
    const filteredUpdates = currentUpdates.filter(update => update.pharmacyId !== pharmacyId);
    this.pharmacyStateChanges.set(filteredUpdates);
  }

  /**
   * Clear all pharmacy updates from the signal
   */
  clearAllPharmacyUpdates(): void {
    this.pharmacyStateChanges.set([]);
  }
}
