import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { PharmacyCard } from '../../shared/components/pharmacy-card/pharmacy-card';
import { PharmacyService } from '../Service/pharmacy-service';
import { Ipharmacy } from '../../shared/models/ipharmacy';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nearby-pharmacies-page',
  imports: [PharmacyCard, RouterModule],
  templateUrl: './nearby-pharmacies-page.html',
  styleUrl: './nearby-pharmacies-page.css',
})
export class NearbyPharmaciesPage implements OnInit {
  // protected pharmacies: Ipharmacy[] = [];
  pharmacies = signal<Ipharmacy[]>([]);

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

    this.pharmacyService.getPharmacies().subscribe({
      next: (data) => {
        this.pharmacies = data;
        this.Loading = false;
        this.cdr.detectChanges(); // Ensure the view updates immediately
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load pharmacies. Please try again later.';
        this.Loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
