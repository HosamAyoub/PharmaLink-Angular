import { Component, OnInit } from '@angular/core';


export interface NearbyPharmacy {
  id: number;
  name: string;
  distance: string;
  price: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  statusText: string;
}


@Component({
  selector: 'app-nearby-pharmacies',
  imports: [],
  templateUrl: './nearby-pharmacies.html',
  styleUrl: './nearby-pharmacies.css'
})
export class NearbyPharmacies implements OnInit {

  mapIntegrationEnabled = true;

  ngOnInit() {
    // Initialize map or location services here
  }


  callPharmacy(phone: string) {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  }

  getDirections(pharmacy: NearbyPharmacy) 
  {
  
  }

  viewOnMap(pharmacy: NearbyPharmacy) {
    
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
      stars += '☆';
    }
    return stars;
  }
}
