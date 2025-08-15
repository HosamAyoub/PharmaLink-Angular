import { Component, inject, signal } from '@angular/core';
import { HomeService } from '../../services/home-service';
import { Product } from "../../../shared/components/product/product";
import { IProduct } from '../../../shared/models/IProduct';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'featured-products',
  imports: [Product, RouterLink],
  templateUrl: './featured-products.html',
  styleUrls: ['./featured-products.css', '../../shared/styles/shared-home.css']
})
export class FeaturedProducts {

  homeSerivice = inject(HomeService);
  products  = signal<IProduct[]>([]);
  imageErrors = new Set<number>(); // Track which images failed to load

  constructor(){
    this.getProducts();
  }


  getProducts() {
    this.homeSerivice.getFeaturedProducts().subscribe(response => {

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
  }

}
