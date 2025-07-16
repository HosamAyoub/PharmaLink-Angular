import { Component } from '@angular/core';

@Component({
  selector: 'pharmacy-section',
  imports: [],
  templateUrl: './pharmacy-section.html',
  styleUrls: ['./pharmacy-section.css', '../../shared/styles/shared-home.css']
})
export class PharmacySection {
  pharmacies = [
    {
      name: 'Green Cross Pharmacy',
      address: '123 Main Street, Downtown',
      rating: 4.5,
      isOpen: true,
      image: 'assets/images/logos/logo.png'
    },
    {
      name: 'City Health Pharmacy',
      address: '456 Oak Avenue, Midtown',
      rating: 4.2,
      isOpen: false,
      image: 'assets/images/logos/logo.png'
    },
    {
      name: 'Quick Care Pharmacy',
      address: '789 Pine Street, Uptown',
      rating: 4.8,
      isOpen: true,
      image: 'assets/images/logos/logo.png'
    }
  ];

  viewAllPharmacies() {
    // TODO: Navigate to all pharmacies page or implement desired functionality
    console.log('View all pharmacies clicked');
  }
}
