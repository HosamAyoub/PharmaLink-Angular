import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { printFullAddress } from './shared/utils/location.util';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'PharmaLink_angular';
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.autoLogin();
    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          // Use userLat and userLng as needed (e.g., center the map, add a marker, etc.)
          console.log('User location:', userLat, userLng);
          // Get and print the accurate location (house_number, road, state, country)
          printFullAddress(userLat, userLng);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Optionally show a message to the user
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
