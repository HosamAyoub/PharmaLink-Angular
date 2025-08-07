import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ConfigService } from '../../../../shared/services/config.service';
import { Observable } from 'rxjs';
import { PharmacyDisplayDTO } from '../Interfaces/pharmacy-display-dto';
import { UiState } from '../../../../shared/enums/UIState';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  editMode = signal(false);
  isLoading = signal(UiState.Loading);
  pharmacy = signal<PharmacyDisplayDTO | undefined>(undefined);
  imagePreviewUrl = signal<string | undefined>(undefined);

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getPharmacyProfile(): Observable<PharmacyDisplayDTO> {
    return this.http.get<PharmacyDisplayDTO>(this.configService.getApiUrl('Pharmacy/pharmacyProfile'));
  }

  updatePharmacyProfile(updated: PharmacyDisplayDTO, photoFile?: File): Observable<PharmacyDisplayDTO> {
    const formData = new FormData();

    formData.append('name', updated.name);
    formData.append('address', updated.address);
    formData.append('phoneNumber', updated.phoneNumber);
    formData.append('email', updated.email);

    if (updated.startHour) formData.append('startHour', updated.startHour.toString());
    if (updated.endHour) formData.append('endHour', updated.endHour.toString());

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    return this.http.put<PharmacyDisplayDTO>(
      this.configService.getApiUrl('Pharmacy/UpdatePharmacy'),
      formData
    );
  }


  toggleEditMode(): void {
    this.editMode.set(!this.editMode());
  }
}
