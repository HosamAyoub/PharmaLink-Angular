import { Component } from '@angular/core';

@Component({
  selector: 'featured-products',
  imports: [],
  templateUrl: './featured-products.html',
  styleUrls: ['./featured-products.css', '../../shared/styles/shared-home.css']
})
export class FeaturedProducts {

  // Products array for the loop
  products = [
    {
      name: 'Paracetamol 500mg',
      price: '$250',
      image: 'assets/images/icons/drug.svg'
    },
    {
      name: 'Paracetamol 500mg',
      price: '$150',
      image: 'assets/images/icons/drug.svg'
    },
    {
      name: 'Paracetamol 500mg',
      price: '$180',
      image: 'assets/images/icons/drug.svg'
    },
    {
      name: 'Paracetamol 500mg',
      price: '$120',
      image: 'assets/images/icons/drug.svg'
    }
  ];

  // Method to toggle favorite status
  toggleFavorite(event: Event) {
    const target = event.target as HTMLElement;
    target.classList.toggle('active');
  }

  viewAllProducts() {
    // TODO: Navigate to all products page or implement desired functionality
    console.log('View all products clicked');
  }

}
