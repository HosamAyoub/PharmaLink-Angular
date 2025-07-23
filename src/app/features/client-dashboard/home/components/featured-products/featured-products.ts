import { Component, inject, signal } from '@angular/core';
import { HomeService } from '../../services/home-service';
import { IProduct } from '../../models/home.types';

@Component({
  selector: 'featured-products',
  imports: [],
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

  // Handle image loading errors
  onImageError(event: Event, productIndex?: number) {
    const imgElement = event.target as HTMLImageElement;
    
    // Set fallback image
    //imgElement.src = 'assets/images/error-placeholder.jpg';
    imgElement.classList.add('error');
    
    // Track error for this product
    if (productIndex !== undefined) {
      this.imageErrors.add(productIndex);
    }
    
  }

  // Handle successful image loading
  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.classList.remove('error');
  }

  // Check if image has error
  hasImageError(index: number): boolean {
    return this.imageErrors.has(index);
  }

  // Get safe image URL
  getSafeImageUrl(product: IProduct): string {
    return product.drugImageUrl || 'assets/images/error-placeholder.jpg';
  }

  // Stock status methods
  getStockStatus(quantity: number): string {
    return quantity > 0 ? 'In Stock' : 'Out of Stock';
  }

  getStockBackgroundColor(quantity: number): string {
    return quantity > 0 ? 'rgb(182, 219, 182)' : 'rgb(255, 182, 182)';
  }

  getStockTextColor(quantity: number): string {
    return quantity > 0 ? 'green' : 'red';
  }

  viewAllProducts() {
    // TODO: Navigate to all products page or implement desired functionality
    console.log('View all products clicked');
  }

}
