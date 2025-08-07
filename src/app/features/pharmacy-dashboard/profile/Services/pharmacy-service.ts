import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ConfigService } from '../../../../shared/services/config.service';
import { Observable } from 'rxjs';
import { PharmacyDisplayDTO } from '../Interfaces/pharmacy-display-dto';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  editMode = signal(false);

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getPharmacyProfile(): Observable<PharmacyDisplayDTO> {
    return this.http.get<PharmacyDisplayDTO>(this.configService.getApiUrl('Pharmacy/pharmacyProfile'));
  }

  updatePharmacyProfile(updated: PharmacyDisplayDTO): Observable<PharmacyDisplayDTO> {
    return this.http.put<PharmacyDisplayDTO>(
      this.configService.getApiUrl('Pharmacy/UpdatePharmacy'),
      updated
    );
  }

  toggleEditMode(): void {
    this.editMode.set(!this.editMode());
  }
}
