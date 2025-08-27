import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { PharmacyCard } from '../../shared/components/pharmacy-card/pharmacy-card';
import { PharmacyService } from '../Service/pharmacy-service';
import { Ipharmacy } from '../../shared/models/ipharmacy';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';
import { NearbyPharmacies } from '../../Details/component/nearby-pharmacies/nearby-pharmacies';
import { IPharmaStock } from '../../Details/model/IPharmaDrug';

@Component({
  selector: 'app-nearby-pharmacies-page',
  imports: [PharmacyCard, NearbyPharmacies, RouterModule],
  templateUrl: './nearby-pharmacies-page.html',
  styleUrl: './nearby-pharmacies-page.css',
})
export class NearbyPharmaciesPage implements OnInit {
  // protected pharmacies: Ipharmacy[] = [];
  pharmacies = signal<Ipharmacy[]>([]);
  nearbyPharmacies = signal<IPharmaStock[]>([]);

  protected errorMessage: string | null = null;
  protected Loading: boolean = true;

  constructor(
    private pharmacyService: PharmacyService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.loadNearbyPharmacies();
  }

  loadNearbyPharmacies(): void {
    this.Loading = true;
    this.errorMessage = null;

    this.pharmacyService.getActivePharmacies().subscribe({
      next: (data) => {
        this.pharmacies.set(data);
        // Map pharmacies to IPharmaStock array and set nearbyPharmacies signal
        const pharmaStocks: IPharmaStock[] = data.map((pharmacy) => ({
          pharma_Id: pharmacy.pharmacyID, // Assuming pharmacy.id exists
          pharma_Name: pharmacy.name,
          pharma_Latitude: pharmacy.latitude,
          pharma_Longitude: pharmacy.longitude,
          pharma_Address: pharmacy.address,
          price: 0,
          quantityAvailable: 0,
          distance: 0,
        }));
        this.nearbyPharmacies.set(pharmaStocks);
        this.Loading = false;
        this.cdr.detectChanges(); // Ensure the view updates immediately
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load pharmacies. Please try again later.';
        this.Loading = false;
        this.cdr.detectChanges(); // Ensure the view updates immediately
      },
    });
  }
}
