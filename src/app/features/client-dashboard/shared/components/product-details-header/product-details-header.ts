import { Component, inject, Input, input, OnInit } from '@angular/core';
import { IPharmaDrug, IPharmaStock } from '../../../Details/model/IPharmaDrug';
import { DrugDetailsService } from '../../../Details/service/drug-details-service';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IDrugDetails } from '../../../Details/model/IDrugDetials';
import { CartStore } from '../../../Cart/Services/cart-store';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CartItem } from '../../../Cart/Interfaces/cart-item';

@Component({
  selector: 'app-product-details-header',
  imports: [CommonModule,RouterLink],
  templateUrl: './product-details-header.html',
  styleUrl: './product-details-header.css'
})
export class ProductDetailsHeader implements OnInit {

  drugId: any;
  @Input() drugDetails!: IDrugDetails;
  @Input() fullDrugData!: IPharmaDrug;
  drugservice: DrugDetailsService = inject(DrugDetailsService);
  FavService: FavoriteService = inject(FavoriteService);
  cartStore = inject(CartStore);
  toastService = inject(ToastService);
  private imageError = false;
    cdr: any;

  ngOnInit() {
    console.log('ProductDetailsHeader received data:');
    console.log('drugDetails:', this.drugDetails);
    console.log('fullDrugData:', this.fullDrugData);
    console.log('Pharmacy info:', this.fullDrugData?.pharma_Info);
  }

  // Getter to ensure we have pharmacy data
  get availablePharmacy() {
    return this.fullDrugData?.pharma_Info?.[0] || null;
  }


       // Handle successful image loading
  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.classList.remove('error');
  }

  // Check if image has error
  hasImageError(): boolean {
    return this.imageError;
  }

    onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    // Set fallback image
    //imgElement.src = 'assets/images/error-placeholder.jpg';
    imgElement.classList.add('error');

    // Track error for this product
      this.imageError = true;
      this.cdr.detectChanges(); // Ensure change detection runs to update the view

  }



  Details_ToggleFavorites(drugId: number)
  {
    this.FavService.ToggleFavorites(drugId);
  }

  Details_isFavorite(drugId: number): boolean {
    return this.FavService.isFavorite(drugId);
  }

  addToCart(drugId: number, event?: Event) {
    // Prevent event from bubbling up to parent elements
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Debug logging
    console.log('Full drug data:', this.fullDrugData);
    console.log('Pharmacy info:', this.fullDrugData?.pharma_Info);

    // Use the getter to get pharmacy information
    const firstPharmacy = this.availablePharmacy;
    
    if (!firstPharmacy) {
      console.error('No pharmacy data found. Full data:', this.fullDrugData);
      this.toastService.showError('No pharmacy information available for this product.');
      return;
    }

    const cartProduct: CartItem = {
      drugId: this.drugDetails.drugID,
      pharmacyId: firstPharmacy.pharma_Id,
      drugName: this.drugDetails.commonName,
      pharmacyName: firstPharmacy.pharma_Name,
      quantity: 1,
      unitPrice: firstPharmacy.price,
      imageUrl: this.drugDetails.drug_UrlImg,
      totalPrice: firstPharmacy.price
    };

    this.cartStore.addToCart(cartProduct).subscribe({
      next: () => {
        this.toastService.showSuccess(`${this.drugDetails.commonName} added to cart successfully!`);
      },
      error: (error: any) => {
        if (error.message && error.message.includes('logged in')) {
          this.toastService.showWarning('Please login to add items to your cart');
        } else {
          this.toastService.showError('Failed to add item to cart. Please try again.');
        }
        console.error('Add to cart error:', error);
      }
    });
  }

}
