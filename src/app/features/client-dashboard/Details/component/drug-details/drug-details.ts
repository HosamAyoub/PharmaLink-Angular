import { Component, inject, Input, computed } from '@angular/core';
import { PharmacyAvailable } from '../pharmacy-available/pharmacy-available';
import { NearbyPharmacies } from '../nearby-pharmacies/nearby-pharmacies';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { IPharmaDrug, IPharmaStock } from '../../model/IPharmaDrug';
import { DrugService } from '../../../Categories_Page/service/drug-service';
import { DrugDetailsService } from '../../service/drug-details-service';
import { IDrug } from '../../../Categories_Page/models/IDrug';
import { DrugImageComponent } from '../../../../../shared/components/drug-image/drug-image';
import { PharmacyProductDetialsService } from '../../../pharamcy-product-details/services/pharmacy-product-detials-service';

@Component({
  selector: 'app-drug-details',
  imports: [PharmacyAvailable, NearbyPharmacies, CommonModule, RouterLink, DrugImageComponent],
  templateUrl: './drug-details.html',
  styleUrl: './drug-details.css',
})
export class DrugDetails {
  drugId: any;
  drugDetails!: IPharmaDrug;
  nearbyPharmacies: IPharmaStock[] = [];
  drugservice: DrugDetailsService = inject(DrugDetailsService);
  FavService: FavoriteService = inject(FavoriteService);
  pharmacyProductDetialsService = inject(PharmacyProductDetialsService);

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
            pharma_Info: [],
          }))
        )
        .subscribe((map) => {
          this.drugDetails = map;
          this.cdr.detectChanges();
        });

      this.pharmacyProductDetialsService.getNearestPharmacies(29.323496187410917, 30.838584748642194, Number(this.drugId)).subscribe({
        next: (pharmacies) => {
          console.log('Nearby pharmacies loaded:', pharmacies);
          // Convert Ipharmacy[] to IPharmaStock[] with mock stock data
          this.nearbyPharmacies = pharmacies.map(pharmacy => ({
            pharma_Id: pharmacy.pharma_Id,
            pharma_Name: pharmacy.pharma_Name,
            pharma_Latitude: pharmacy.pharma_Latitude,
            pharma_Longitude: pharmacy.pharma_Longitude,
            pharma_Address: pharmacy.pharma_Address,
            price: pharmacy.price, // Mock price since not available in Ipharmacy
            quantityAvailable: pharmacy.quantityAvailable, // Mock quantity
            distance: pharmacy.distance // Mock distance
          }));
          console.log('Converted nearby pharmacies for components:', this.nearbyPharmacies);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching nearby pharmacies:', error);
        }
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

  // Mock methods for converting Ipharmacy to IPharmaStock
  private calculateMockDistance(): number {
    // Generate random distance between 0.5 and 2.0 km
    return Math.round((Math.random() * 1.5 + 0.5) * 100) / 100;
  }

  private calculateMockPrice(): number {
    // Generate random price between 10 and 100
    return Math.round((Math.random() * 90 + 10) * 100) / 100;
  }

  private calculateMockQuantity(): number {
    // Generate random quantity between 0 and 50
    return Math.floor(Math.random() * 51);
  }
}
