import { Component, Input, ChangeDetectorRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../../Cart/Services/cart-store';
import {CartUpdateDto} from '../../../Cart/Interfaces/cart-update-dto';
import { IPharmaStock } from '../../model/IPharmaDrug';
import { CartItem } from '../../../Cart/Interfaces/cart-item';
import { DrugDetails } from '../drug-details/drug-details';
import { IDrugDetails } from '../../model/IDrugDetials';
import { ToastService } from '../../../../../shared/services/toast.service';
import { APP_CONSTANTS } from '../../../../../shared/constants/app.constants';

@Component({
  selector: 'app-pharmacy-available',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pharmacy-available.html',
  styleUrls: ['./pharmacy-available.css'],
})
export class PharmacyAvailable {
  private _pharmacies: IPharmaStock[] = [];
  cartStore = inject(CartStore);
  toastService = inject(ToastService);
  price = signal<number>(0);
  priceMap = new Map<number, number>();


  @Input()
  set pharmacies(value: IPharmaStock[]) {
    this._pharmacies = value;
    setTimeout(() =>
    {
      this.cdr.detectChanges();
    });
  }

  @Input() drug: IDrugDetails | null = null;

  get pharmacies() {
    return this._pharmacies;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  SendToCart(pharmacy: IPharmaStock, quantityInput: HTMLInputElement)
  {
    // Debug logging
    console.log('Drug data:', this.drug);
    console.log('Pharmacy data:', pharmacy);

    if (!quantityInput) {
      this.toastService.showError('Please enter a valid quantity');
      return;
    }

    // Validate quantity input
    const quantityValue = parseInt(quantityInput.value);
    if (quantityValue <= 0 || quantityValue > pharmacy.quantityAvailable) {
      this.toastService.showError('Please enter a valid quantity');
      return;
    }



    const cartItem: CartItem = {
      drugId: this.drug!.drugID,
      pharmacyId: pharmacy.pharma_Id,
      drugName: this.drug!.commonName, // Use drug name instead of pharmacy name
      pharmacyName: pharmacy.pharma_Name,
      imageUrl: this.drug!.drug_UrlImg,
      unitPrice: pharmacy.price,
      quantity: quantityValue,
      totalPrice: pharmacy.price * quantityValue,
    };

    console.log('Cart item being added:', cartItem);

    this.cartStore.addToCart(cartItem).subscribe({
      next: () => {
        this.toastService.showSuccess(`${this.drug!.commonName} added to cart successfully!`);
        // Reset quantity input to 1 after successful add
        quantityInput.value = '1';
      },
      error: (error: any) => {
        if (error.code == APP_CONSTANTS.ErrorCodes.DIFFERENT_PHARMACY) {
          this.toastService.showError('You can not add products from different pharmacies to the cart.');
        } else {
          this.toastService.showError('Failed to add item to cart. Please try again.');
        }
        console.error('Add to cart error:', error);
      }
    });
  }

  changeprice(event: Event, pharmacy: IPharmaStock) {
  const input = event.target as HTMLInputElement;
  const quantity = Number(input.value) || 1;
  const total = pharmacy.price * quantity;

  this.priceMap.set(pharmacy.pharma_Id, total);
}

getTotal(pharmacy: IPharmaStock): number {
  return this.priceMap.get(pharmacy.pharma_Id) ?? pharmacy.price;
}
}
