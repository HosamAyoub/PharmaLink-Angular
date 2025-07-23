import { Component, inject, signal } from '@angular/core';
import { IPharmacy } from '../../models/home.types';
import { HomeService } from '../../services/home-service';

@Component({
  selector: 'pharmacy-section',
  imports: [],
  templateUrl: './pharmacy-section.html',
  styleUrls: ['./pharmacy-section.css', '../../shared/styles/shared-home.css']
})
export class PharmacySection {
  homeService = inject(HomeService);
  pharmacies = signal<IPharmacy[]>([]);


  constructor() {
    this.loadPharmacies();
  }

  loadPharmacies() {
    this.homeService.getNearbyPharmacies().subscribe({
      next: (data) => {
        // Take only the first 3 pharmacies
        let pharmaciesData = data.slice(0, 3);
        pharmaciesData.forEach(pharmacy => {
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
      }
    });
  }
  viewAllPharmacies() {
    // TODO: Navigate to all pharmacies page or implement desired functionality
    console.log('View all pharmacies clicked');
  }
}
