import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PharmacyCard } from "../../../shared/components/pharmacy-card/pharmacy-card";
import { single } from 'rxjs';
import { Ipharmacy } from '../../../shared/models/ipharmacy';
import { PharmacyService } from '../../../Pharmacies/Service/pharmacy-service';
import { PharmacyProductsService } from '../../services/pharamcy-products-service';
import { SideBar } from "../../../shared/components/side-bar/side-bar";


@Component({
  selector: 'client-pharmacy-stock',
  imports: [PharmacyCard, SideBar],
  templateUrl: './pharmacy-stock.html',
  styleUrl: './pharmacy-stock.css'
})
export class PharmacyStock {
  pharmacyService = inject(PharmacyProductsService);
  pharmacyId = signal<number>(0);
  // Signal to hold pharmacy details
  pharmacyDetails = signal<Ipharmacy>({} as Ipharmacy);


  constructor() {
    const route = inject(ActivatedRoute);
    // Get pharmacyId from route params
    route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.pharmacyId.set(id);
        this.loadPharmacy();
      } else {
        console.warn('Pharmacy ID is not set in route');
      }
    });
  }

  loadPharmacy() {
    console.log('Loading pharmacy with ID:', this.pharmacyId());
    if (this.pharmacyId()) {
      this.pharmacyService.getPharmacyProduct(this.pharmacyId()).subscribe({
        next: (data) => {
          this.pharmacyDetails.set(data);
        },
        error: (error) => {
          console.error('Error fetching pharmacy data:', error);
        }
      });
    } else {
      console.warn('Pharmacy ID is not set');
    }
  }

}
