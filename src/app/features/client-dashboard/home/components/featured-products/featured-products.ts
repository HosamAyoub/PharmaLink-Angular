import { Component, inject, signal } from '@angular/core';
import { HomeService } from '../../services/home-service';
import { IProduct } from '../../models/home.types';
import { Product } from "../product/product";

@Component({
  selector: 'featured-products',
  imports: [Product],
  templateUrl: './featured-products.html',
  styleUrls: ['./featured-products.css', '../../shared/styles/shared-home.css']
})
export class FeaturedProducts {

  homeSerivice = inject(HomeService);
  products  = signal<IProduct[]>([]);
  imageErrors = new Set<number>(); // Track which images failed to load

  constructor(){
    console.log('FeaturedProducts component initialized');
    this.getProducts();
  }


  getProducts() {
    this.homeSerivice.getFeaturedProducts().subscribe(response => {
      console.log('Featured Products Response:', response);

      if (response.success) {
      this.products.set(response.data);
      } else {
      this.products.set([]);
      console.error(response.errors);
      }
    });
  }

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
