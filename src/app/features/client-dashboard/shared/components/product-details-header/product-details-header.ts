import { Component, inject, Input, input } from '@angular/core';
import { IPharmaDrug } from '../../../Details/model/IPharmaDrug';
import { DrugDetailsService } from '../../../Details/service/drug-details-service';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IDrugDetails } from '../../../Details/model/IDrugDetials';

@Component({
  selector: 'app-product-details-header',
  imports: [CommonModule,RouterLink],
  templateUrl: './product-details-header.html',
  styleUrl: './product-details-header.css'
})
export class ProductDetailsHeader {

  drugId: any;
  @Input() drugDetails!: IDrugDetails;
  drugservice: DrugDetailsService = inject(DrugDetailsService);
  FavService: FavoriteService = inject(FavoriteService);
  private imageError = false;
    cdr: any;


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

  addToCart(drugId: number) {
    // TODO: Implement add to cart functionality
    // This could involve calling a cart service to add the product
    console.log('Adding product to cart:', drugId);

    // Example implementation (you can replace this with your actual cart service):
    // this.cartService.addToCart(drugId, 1); // Add 1 quantity

    // Show success message or feedback to user
    // this.toastr.success('Product added to cart successfully!');
  }

}
