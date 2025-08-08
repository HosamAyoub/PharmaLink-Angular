import { Component, OnInit, inject} from '@angular/core';
import { PharmacyDisplayDTO } from '../Interfaces/pharmacy-display-dto';
import { PharmacyService } from '../Services/pharmacy-service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { UiState } from '../../../../shared/enums/UIState';

@Component({
  selector: 'app-pharmacy-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinner],
  templateUrl: './pharmacy-profile-page.html',
  styleUrl: './pharmacy-profile-page.css'
})
export class PharmacyProfilePage implements OnInit {

  private pharmacyService = inject(PharmacyService);

  pharmacy = this.pharmacyService.pharmacy;
  _imagePreviewUrl = this.pharmacyService.imagePreviewUrl;
  isLoading = this.pharmacyService.isLoading;
  editMode = this.pharmacyService.editMode;
  public UiState = UiState;

  private originalPharmacy: PharmacyDisplayDTO | null = null;
  private selectedPhotoFile?: File;

  ngOnInit(): void {
    this.loadPharmacyProfile();
  }

  private loadPharmacyProfile(): void {
    this.isLoading.set(UiState.Loading);

    this.pharmacyService.getPharmacyProfile().subscribe({
      next: (data) => {
        this.pharmacy.set(data);
        this.originalPharmacy = structuredClone(data);

        if (data.imgUrl) {
          this._imagePreviewUrl.set(data.imgUrl);
        }

        console.log("Pharmacy profile loaded:", data);
        this.isLoading.set(UiState.Success);
      },
      error: (err) => {
        console.error("Failed to load profile:", err);
        this.isLoading.set(UiState.Error);
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      this.selectedPhotoFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this._imagePreviewUrl.set(reader.result as string);
      };
      reader.readAsDataURL(this.selectedPhotoFile);
    }
  }

  get imagePreviewUrl() {
  return this._imagePreviewUrl(); 
}

  toggleEditMode(): void {
    if (this.editMode()) {
      this.saveProfile();
    } else {
      this.editMode.set(true);
    }
  }

  private saveProfile(): void {
    this.isLoading.set(UiState.Loading);

    const updated = this.pharmacy();
    if (!updated) return;

    this.pharmacyService.updatePharmacyProfile(updated, this.selectedPhotoFile).subscribe({
      next: (updatedPharmacy) => {
        this.pharmacy.set(updatedPharmacy);
        this.originalPharmacy = structuredClone(updatedPharmacy);
        this.editMode.set(false);
        this.selectedPhotoFile = undefined;
        console.log("Pharmacy profile updated.");
        this.isLoading.set(UiState.Success);
      },
      error: (err) => {
        console.error("Update failed:", err);
        this.isLoading.set(UiState.Error);
      }
    });
  }

  cancelEdit(): void {
    if (this.originalPharmacy) {
      this.pharmacy.set(structuredClone(this.originalPharmacy));
    }
    this.editMode.set(false);
  }

  get pharmacyRate(): number {
    return +(this.pharmacy()?.rate ?? 0);
  }
}
