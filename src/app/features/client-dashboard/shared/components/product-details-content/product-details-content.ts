import { Component, Input } from '@angular/core';
import { IPharmaDrug } from '../../../Details/model/IPharmaDrug';
import { IDrugDetails } from '../../../Details/model/IDrugDetials';

@Component({
  selector: 'app-product-details-content',
  imports: [],
  templateUrl: './product-details-content.html',
  styleUrl: './product-details-content.css'
})
export class ProductDetailsContent {

   @Input() drugDetails!: IDrugDetails;


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
