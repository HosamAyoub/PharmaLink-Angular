import { Component, inject, signal } from '@angular/core';
import { DrugService } from '../Categories_Page/service/drug-service';
import { IDrugDetails } from '../Details/model/IDrugDetials';
import { ActivatedRoute } from '@angular/router';
import { DrugDetailsService } from '../Details/service/drug-details-service';
import { ProductDetailsHeader } from "../shared/components/product-details-header/product-details-header";
import { ProductDetailsContent } from "../shared/components/product-details-content/product-details-content";
import { IPharmaDrug } from '../Details/model/IPharmaDrug';

@Component({
  selector: 'app-pharamcy-product-details',
  imports: [ProductDetailsHeader, ProductDetailsContent],
  templateUrl: './pharamcy-product-details.html',
  styleUrl: './pharamcy-product-details.css'
})
export class PharamcyProductDetails {

  drugService = inject(DrugDetailsService);
  drugDetails = signal<IPharmaDrug | null>(null);
  drugId = signal<number>(0);


  constructor() {
    const route = inject(ActivatedRoute);
    // Get pharmacyId from route params
    route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.drugId.set(id);
        this.loadDrug();
      } else {
        console.warn('Drug ID is not set in route');
      }
    });
  }

  loadDrug() {
    this.drugService.getDrugById(this.drugId()).subscribe({
      next: (data) => {
        this.drugDetails.set(data);
      },
      error: (error) => {
        console.error('Error fetching drug details:', error);
        this.drugDetails.set(null);
      }
    });
  }


}
