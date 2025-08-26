import { Router } from '@angular/router';
import { Component, Input, signal, computed, inject } from '@angular/core';
import { IProduct } from '../../models/IProduct';
import { CartStore } from '../../../Cart/Services/cart-store';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CartItem } from '../../../Cart/Interfaces/cart-item';
import { APP_CONSTANTS } from '../../../../../shared/constants/app.constants';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { IDrug } from '../../../Categories_Page/models/IDrug';
import { DrugImageComponent } from '../../../../../shared/components/drug-image/drug-image';

@Component({
  selector: 'app-product',
  imports: [CommonModule, DrugImageComponent],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {
  router = inject(Router);

  // Navigate to drug details page
  goToDrugDetails() {
    if (this.product && this.product.drugId) {
      this.router.navigate([`/client/DrugDetails`, this.product.drugId]);
    }
  }
  @Input() product!: IProduct;
  @Input() showPharmacyName: boolean = false;
  @Input() index: number = 0;
  favService = inject(FavoriteService);

  cartStore = inject(CartStore);
  toastService = inject(ToastService);

  // Create a computed property that reactively tracks favorite changes
  favoriteDrugs = computed(() => this.favService.favoriteDrugs());

  // Check if this specific product is a favorite
  isFavorite = computed(() => {
    const favorites = this.favoriteDrugs();
    if (!Array.isArray(favorites) || !this.product) return false;
    return favorites.some(d => d.drugId === this.product.drugId);
  });

  // Add a method to perform an action on this product
  performAction() {
    // Product action implementation
  }

  addToCart(product: IProduct, event?: Event) {
    // Prevent event from bubbling up to parent elements (like navigation click)
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    const cartProduct: CartItem ={
      drugId: product.drugId,
      pharmacyId: product.pharmacyId,
      drugName: product.drugName,
      pharmacyName: product.pharmacyName,
      quantity: 1,
      unitPrice: parseFloat(product.price),
      imageUrl: product.drugImageUrl,
      totalPrice: parseFloat(product.price)

    }

    this.cartStore.addToCart(cartProduct).subscribe({
      next: () => {
        this.toastService.showSuccess(`${product.drugName} added to cart successfully!`);
      },
      error: (error: any) => {
        if(error.code == APP_CONSTANTS.ErrorCodes.DIFFERENT_PHARMACY) {
          this.toastService.showError('You can not add products from different pharmacies to the cart.');
        } else {
          this.toastService.showError('Failed to add item to cart. Please try again.');
        }
        console.error('Add to cart error:', error);
      }
    });
  }

  // Method to toggle favorite status
  toggleFavorite(event: Event) {
    // Prevent event from bubbling up
    event.stopPropagation();
    event.preventDefault();

    const drug : IDrug = {
      name: this.product.drugName,
      imageUrl: this.product.drugImageUrl,
      description: this.product.drugDescription || '',
      drugId: this.product.drugId,
      drugCategory: this.product.drugCategory
    }

    // Use the service to toggle favorites - this will update the signal reactively
    this.favService.ToggleFavorites(drug);

    // Remove manual DOM manipulation - let Angular handle the reactive updates
    // The template will update automatically based on the isFavorite computed property
  }

  // Method called by template to get image source
  getImageSource(): string {
    return this.getSafeImageUrl(this.product);
  }

  // Get safe image URL with better validation
  getSafeImageUrl(product: IProduct): string {
    const imageUrl = product.drugImageUrl;

    // Check if URL is valid and has proper format
    if (!imageUrl || imageUrl.trim() === '') {
      return 'assets/images/error-image.jpg';
    }

    // Check for common invalid URL patterns
    if (imageUrl.includes('localhost') && !imageUrl.includes(window.location.hostname)) {
      return 'assets/images/error-image.jpg';
    }

    // Check if URL looks like a valid image URL
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some(ext =>
      imageUrl.toLowerCase().includes(ext)
    );

    if (!hasValidExtension && !imageUrl.includes('http')) {
    }

    // Log the image URL for debugging

    return imageUrl;
  }

  // Stock status methods
  getStockStatus(quantity: number): string {
    return quantity > 0 ? 'In Stock' : 'Out of Stock';
  }

  getStockBackgroundColor(quantity: number): string {
    return quantity > 0 ? 'var(--background-mint)' : 'var(--status-red-background)';
  }

  getStockTextColor(quantity: number): string {
    return quantity > 0 ? 'var(--success-green)' : 'var(--status-red)';
  }

}
