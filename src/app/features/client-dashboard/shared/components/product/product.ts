import { Component, Input, signal, computed, inject } from '@angular/core';
import { IProduct } from '../../models/IProduct';
import { CartStore } from '../../../Cart/Services/cart-store';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CartItem } from '../../../Cart/Interfaces/cart-item';
import { APP_CONSTANTS } from '../../../../../shared/constants/app.constants';

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


  // Simple approach - track the last product ID we processed
  private lastProductId: string | number = '';
  private imageErrorState = signal(false);

  cartStore = inject(CartStore);
  toastService = inject(ToastService);

  // Computed property that resets error state when product changes
  imageSource = computed(() => {
    // Check if product has changed
    if (this.product && this.product.drugId !== this.lastProductId) {
      this.lastProductId = this.product.drugId;
      this.imageErrorState.set(false); // Reset error state for new product
      console.log(`New product detected: ${this.product.drugName}, resetting image error state`);
    }

    // Return appropriate image source
    if (this.imageErrorState()) {
      return 'assets/images/error-image.jpg';
    }
    return this.getSafeImageUrl(this.product);
  });

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

    // Handle image loading errors
  onImageError(event: Event, productIndex?: number) {
    const imgElement = event.target as HTMLImageElement;

    // Set fallback image
    //imgElement.src = 'assets/images/error-placeholder.jpg';
    imgElement.classList.add('error');
    this.imageErrorState.set(true);

    // Log the error for debugging
    console.error(`Image failed to load for product ${this.product?.drugName}:`, {
      originalSrc: imgElement.src,
      productId: this.product?.drugId,
      error: event
    });
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
    this.imageErrorState.set(false); // Reset error state when image loads successfully

    console.log(`Image loaded successfully for product ${this.product?.drugName}`);
  }

  // Check if image has error
  hasImageError(): boolean {
    return this.imageErrorState();
  }

  // Method called by template to get image source
  getImageSource(): string {
    // // Check if product has changed and reset error state
    // if (this.product && this.product.drugId !== this.lastProductId) {
    //   this.lastProductId = this.product.drugId;
    //   this.imageErrorState.set(false);
    //   console.log(`Product changed in getImageSource: ${this.product.drugName}, resetting error state`);
    // }

    // // Return appropriate image source
    // if (this.imageErrorState()) {
    //   return 'assets/images/error-image.jpg';
    // }
    return this.getSafeImageUrl(this.product);
  }

  // Method to manually reset image error state
  resetImageState(): void {
    this.imageErrorState.set(false);
    this.lastProductId = ''; // Force reset of product tracking
    console.log(`Image state reset for product: ${this.product?.drugName}`);
  }

  // Method to force refresh the image (useful when product data changes but ID remains same)
  forceImageRefresh(): void {
    this.imageErrorState.set(false);
    // Force the image to reload by updating the src
    setTimeout(() => {
      const imgElements = document.querySelectorAll(`img[alt="${this.product?.drugName}"]`);
      imgElements.forEach((img: any) => {
        if (img.src) {
          const originalSrc = img.src;
          img.src = '';
          img.src = originalSrc;
        }
      });
    }, 50);
  }

  // Get safe image URL with better validation
  getSafeImageUrl(product: IProduct): string {
    const imageUrl = product.drugImageUrl;

    // Check if URL is valid and has proper format
    if (!imageUrl || imageUrl.trim() === '') {
      console.log(`Empty image URL for product ${product.drugName}`);
      return 'assets/images/error-image.jpg';
    }

    // Check for common invalid URL patterns
    if (imageUrl.includes('localhost') && !imageUrl.includes(window.location.hostname)) {
      console.log(`Invalid localhost URL for product ${product.drugName}: ${imageUrl}`);
      return 'assets/images/error-image.jpg';
    }

    // Check if URL looks like a valid image URL
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some(ext =>
      imageUrl.toLowerCase().includes(ext)
    );

    if (!hasValidExtension && !imageUrl.includes('http')) {
      console.log(`Potentially invalid image URL for product ${product.drugName}: ${imageUrl}`);
    }

    // Log the image URL for debugging
    console.log(`Loading image for ${product.drugName}: ${imageUrl}`);

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
