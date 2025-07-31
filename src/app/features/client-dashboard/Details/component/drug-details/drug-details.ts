import { Component, inject, Input } from '@angular/core';
import { PharmacyAvailable } from '../pharmacy-available/pharmacy-available';
import { NearbyPharmacies } from '../nearby-pharmacies/nearby-pharmacies';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { IPharmaDrug } from '../../model/IPharmaDrug';
import { DrugService } from '../../../Categories_Page/service/drug-service';
import { DrugDetailsService } from '../../service/drug-details-service';

@Component({
  selector: 'app-drug-details',
  imports: [PharmacyAvailable, NearbyPharmacies, CommonModule,RouterLink],
  templateUrl: './drug-details.html',
  styleUrl: './drug-details.css',
})
export class DrugDetails {
  drugId: any;
  drugDetails!: IPharmaDrug;
  drugservice: DrugDetailsService = inject(DrugDetailsService);
  FavService: FavoriteService = inject(FavoriteService);
  private imageError = false;
  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.drugId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.drugId) {
      this.drugservice
        .getDrugById(Number(this.drugId))
        .pipe(
          map((drug) => ({
            drug_Info: drug.drug_Info,
            pharma_Info: drug.pharma_Info,
          }))
        )
        .subscribe((map) => {
          this.drugDetails = map;
          this.cdr.detectChanges();
          console.log('Drug Details:', this.drugDetails);
        });
    }
  }

  expandedSections = {
    indications_and_usage: true,
    dosage_and_administration: false,
    dosage_forms_and_strengths: false,
    contraindications: false,
    warnings_and_cautions: false,
    drug_interactions: false,
    description: false,
    storage_and_handling: false,
    adverse_reactions: false,
    alternatives_names: false,
  };

  toggleSection(section: keyof typeof this.expandedSections) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  Details_ToggleFavorites(drugId: number)
  {
    this.FavService.ToggleFavorites(drugId);
  }

  Details_isFavorite(drugId: number): boolean {
    return this.FavService.isFavorite(drugId);
  }

     // Handle successful image loading
  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.classList.remove('error');
  }

  // Check if image has error
  hasImageError(): boolean {
    return this.imageError;
  }

    onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    // Set fallback image
    //imgElement.src = 'assets/images/error-placeholder.jpg';
    imgElement.classList.add('error');

    // Track error for this product
      this.imageError = true;
      this.cdr.detectChanges(); // Ensure change detection runs to update the view

  }


}
