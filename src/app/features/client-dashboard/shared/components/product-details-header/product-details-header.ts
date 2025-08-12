import { Component, inject, Input, input, OnInit, computed } from '@angular/core';
import { IPharmaDrug, IPharmaStock } from '../../../Details/model/IPharmaDrug';
import { DrugDetailsService } from '../../../Details/service/drug-details-service';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IDrugDetails } from '../../../Details/model/IDrugDetials';
import { CartStore } from '../../../Cart/Services/cart-store';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CartItem } from '../../../Cart/Interfaces/cart-item';
import { IDrug } from '../../../Categories_Page/models/IDrug';
import { DrugImageComponent } from '../../../../../shared/components/drug-image/drug-image';

@Component({
  selector: 'app-product-details-header',
  imports: [CommonModule, RouterLink, DrugImageComponent],
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

  // Create a computed property that reactively tracks favorite changes
  favoriteDrugs = computed(() => this.FavService.favoriteDrugs());

  ngOnInit() {
  }

  // Getter to ensure we have pharmacy data
  get availablePharmacy() {
    return this.fullDrugData?.pharma_Info?.[0] || null;
  }



  Details_ToggleFavorites(drugId: number)
  {
    const drug : IDrug= {
      drugId: this.drugDetails.drugID,
      name: this.drugDetails.commonName,
      description: this.drugDetails.description,
      imageUrl: this.drugDetails.drug_UrlImg,
      drugCategory: this.drugDetails.category
    };
    this.FavService.ToggleFavorites(drug);
  }

  Details_isFavorite(drugId: number): boolean {
    // Use the computed property to make this reactive
    const favorites = this.favoriteDrugs();
    if (!Array.isArray(favorites)) return false;
    return favorites.some(d => d.drugId === drugId);
  }

  addToCart(drugId: number, event?: Event) {
    // Prevent event from bubbling up to parent elements
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Debug logging

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
