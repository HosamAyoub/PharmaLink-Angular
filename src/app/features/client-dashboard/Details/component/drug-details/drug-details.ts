import { Component, inject, Input, computed } from '@angular/core';
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
import { IDrug } from '../../../Categories_Page/models/IDrug';
import { DrugImageComponent } from '../../../../../shared/components/drug-image/drug-image';

@Component({
  selector: 'app-drug-details',
  imports: [PharmacyAvailable, NearbyPharmacies, CommonModule, RouterLink, DrugImageComponent],
  templateUrl: './drug-details.html',
  styleUrl: './drug-details.css',
})
export class DrugDetails {
  drugId: any;
  drugDetails!: IPharmaDrug;
  drugservice: DrugDetailsService = inject(DrugDetailsService);
  FavService: FavoriteService = inject(FavoriteService);

  // Create a computed property that reactively tracks favorite changes
  favoriteDrugs = computed(() => this.FavService.favoriteDrugs());

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

  Details_ToggleFavorites()
  {
    const druginfo = this.drugDetails.drug_Info;
    const drug:IDrug =
    {
      name: druginfo.commonName,
      imageUrl: druginfo.drug_UrlImg,
      description: druginfo.description,
      drugId: druginfo.drugID,
      drugCategory: druginfo.category
      // Add other properties as needed
    }
    this.FavService.ToggleFavorites(drug);
  }

  Details_isFavorite(drugId: number): boolean {
    // Use the computed property to make this reactive
    const favorites = this.favoriteDrugs();
    if (!Array.isArray(favorites)) return false;
    return favorites.some(d => d.drugId === drugId);
  }

}
