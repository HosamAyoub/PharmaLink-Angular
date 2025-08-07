import { Component, effect, OnInit, signal } from '@angular/core';
import { PharmacyDisplayDTO } from '../Interfaces/pharmacy-display-dto';
import { PharmacyService } from '../Services/pharmacy-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pharmacy-profile-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './pharmacy-profile-page.html',
  styleUrl: './pharmacy-profile-page.css'
})
export class PharmacyProfilePage implements OnInit {
  constructor(private pharmacyService: PharmacyService) { }
  pharmacy = signal<PharmacyDisplayDTO | undefined>(undefined);
  originalPharmacy: PharmacyDisplayDTO | null = null;

  isOpen: boolean = true;
  editMode = signal(false);

  ngOnInit(): void {
    this.editMode = this.pharmacyService.editMode;
    this.loadPharmacyProfile();
  }

  loadPharmacyProfile() {
    this.pharmacyService.getPharmacyProfile().subscribe(data => {
      this.pharmacy.set(data);
      this.originalPharmacy = structuredClone(data);
    })
  };

  toggleEditMode() {
    if (this.editMode()) {
      this.saveProfile();
    } else {
      this.editMode.set(true);
    }
  }

  saveProfile() {
    const updated = this.pharmacy();
    if (!updated) return;

    this.pharmacyService.updatePharmacyProfile(updated).subscribe({
      next: (updatedPharmacy) => {
        this.pharmacy.set(updatedPharmacy);
        this.originalPharmacy = structuredClone(updatedPharmacy);
        this.editMode.set(false);
        console.log("Pharmacy profile updated.");
      },
      error: (err) => {
        console.error("Update failed", err);
      }
    });
  }

  cancelEdit() {
    if (this.originalPharmacy) {
      this.pharmacy.set(structuredClone(this.originalPharmacy));
    }
    this.editMode.set(false);
  }
}