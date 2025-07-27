import { Component, inject, signal, OnInit } from '@angular/core';
import { Slider } from "../components/slider/slider";
import { ServiceSection } from "../components/service-section/service-section";
import { CategorySection } from "../components/category-section/category-section";
import { FeaturedProducts } from '../components/featured-products/featured-products';
import { PharmacySection } from "../components/pharmacy-section/pharmacy-section";
import { HomeService } from '../services/home-service';
import { UserLocation } from '../models/home.types';

@Component({
  selector: 'app-home-screen',
  imports: [Slider, ServiceSection, CategorySection, FeaturedProducts, PharmacySection],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.css'
})
export class HomeScreen implements OnInit {

  private homeService = inject(HomeService);
  userLocation = signal<UserLocation | null>(null);
  locationError = signal<string | null>(null);
  isLoadingLocation = signal<boolean>(false);
  private hasShownPermissionAlert = false; // Flag to prevent repeated alerts

  ngOnInit() {
    this.getUserLocation();
  }  private getUserLocation() {
    this.isLoadingLocation.set(true);
    this.locationError.set(null);

    this.homeService.getUserLocation().subscribe({
      next: (location: UserLocation) => {
        this.userLocation.set(location);
        this.isLoadingLocation.set(false);
        console.log('User location obtained:', location);
      },
      error: (error) => {
        this.isLoadingLocation.set(false);
        this.handleLocationError(error);
      }
    });
  }

  private handleLocationError(error: any) {

  if(error.code){
    if(error.code === error.PERMISSION_DENIED) {
      if (!this.hasShownPermissionAlert) {
        this.hasShownPermissionAlert = true;
        this.showLocationPermissionAlert();
      }
    }
    else {
      this.showGenericLocationAlert();
    }
  }
  }

  private showLocationPermissionAlert() {
    const userChoice = confirm(
      '🌍 Location Access Required\n\n' +
      'To show you nearby pharmacies and provide better service, we need access to your location.\n\n' +
      'If you previously denied permission, please:\n' +
      '1. Click the location icon (🔒) in your browser\'s address bar\n' +
      '2. Change location setting to "Allow"\n' +
      '3. Refresh the page\n\n' +
      'Click "OK" to continue without location or "Cancel" to close this message.'
    );

  }



  private showGenericLocationAlert() {
    const userChoice = confirm(
      '⚠️ Location Error\n\n' +
      'We couldn\'t get your location due to a technical issue.\n\n' +
      'Click "OK" to try again or "Cancel" to continue without location services.'
    );

    if (userChoice) {
      setTimeout(() => {
        this.retryLocation();
      }, 500);
    }
  }  // Method to retry getting location (public method for manual retry)
  retryLocation() {
    // Reset the flag to allow showing alert again if needed
    this.hasShownPermissionAlert = false;
    this.getUserLocation();
  }

}
