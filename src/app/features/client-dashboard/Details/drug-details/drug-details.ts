import { Component, inject, Input } from '@angular/core';
import { IDrug } from '../../../../core/drug/IDrug';
import { PharmacyAvailable } from '../pharmacy-available/pharmacy-available';
import { NearbyPharmacies } from '../nearby-pharmacies/nearby-pharmacies';
import { DrugService } from '../../../../core/drug/drug-service';
import { ActivatedRoute } from '@angular/router';
import { IPharmaDrug } from '../../../../core/drug/IPharmaDrug';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-drug-details',
  imports: [PharmacyAvailable, NearbyPharmacies, CommonModule],
  templateUrl: './drug-details.html',
  styleUrl: './drug-details.css',
})
export class DrugDetails {
  drugId: any;
  drugDetails!: IPharmaDrug;
  drugservice: DrugService = inject(DrugService);
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
}
