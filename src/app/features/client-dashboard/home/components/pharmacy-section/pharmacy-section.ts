import { Component, inject, signal, input, effect } from '@angular/core';
import { IPharmacy, UserLocation } from '../../models/home.types';
import { HomeService } from '../../services/home-service';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pharmacy-section',
  imports: [RouterModule],
  templateUrl: './pharmacy-section.html',
  styleUrls: ['./pharmacy-section.css', '../../shared/styles/shared-home.css'],
})
export class PharmacySection {
  homeService = inject(HomeService);
  pharmacies = signal<IPharmacy[]>([]);

  // Input to receive user location from parent component
  userLocation = input<UserLocation | null>(null);

  constructor() {
    this.loadPharmacies();

    // Effect to reload pharmacies when location changes
    effect(() => {
      const location = this.userLocation();
      if (location) {
        this.loadPharmacies(location.latitude, location.longitude);
      }
    });
  }

  loadPharmacies(latitude?: number, longitude?: number) {
    this.homeService.getNearbyPharmacies(latitude, longitude).subscribe({
      next: (data) => {
        // Take only the first 3 pharmacies
        let pharmaciesData = data.slice(0, 3);
        pharmaciesData.forEach((pharmacy) => {
          // Get current time in HH:MM:SS format
          const currentTime = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });


          // Check if pharmacy is open now
          pharmacy.isOpen = currentTime >= pharmacy.startHour && currentTime <= pharmacy.endHour;

        });
        this.pharmacies.set(pharmaciesData);
      },
      error: (error) => {
        console.error('Error fetching nearby pharmacies:', error);
      },
    });
  }
  viewAllPharmacies() {
    // TODO: Navigate to all pharmacies page or implement desired functionality
  }
}
