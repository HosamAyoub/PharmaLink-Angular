import { Component, Input, input, signal } from '@angular/core';
import { IProduct } from '../../models/home.types';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {
  @Input() product!: IProduct;
  @Input() showPharmacyName: boolean = false;
  @Input() index: number = 0;
   imageErrors = new Set<number>(); // Track which images failed to load

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

  // Method to toggle favorite status
  toggleFavorite(event: Event) {
    const target = event.target as HTMLElement;
    target.classList.toggle('active');
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
    return product.drugImageUrl || 'assets/images/error-image.jpg';
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

}
