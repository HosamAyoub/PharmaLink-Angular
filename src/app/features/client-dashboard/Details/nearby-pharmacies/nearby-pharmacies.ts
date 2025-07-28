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

  pharmacy : NearbyPharmacy = {
    id: 1,
    name:'Pharmacy A',
    distance: '2 miles',
    price: 10.99,
    status: 'in-stock',
    statusText: 'In Stock'
  }

  getDirections(pharmacy: NearbyPharmacy) 
  {
  
  }

  viewOnMap(pharmacy: NearbyPharmacy) {
    
    console.log('View on map:', pharmacy);
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
