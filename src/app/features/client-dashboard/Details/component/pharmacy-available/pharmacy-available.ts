import { Component, Input, ChangeDetectorRef, inject, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../../Cart/Services/cart-store';
import {CartUpdateDto} from '../../../Cart/Interfaces/cart-update-dto';
import { ViewChild } from '@angular/core';
import { IPharmaStock } from '../../model/IPharmaDrug';
import { CartItem } from '../../../Cart/Interfaces/cart-item';
import { DrugDetails } from '../drug-details/drug-details';
import { IDrugDetails } from '../../model/IDrugDetials';

@Component({
  selector: 'app-pharmacy-available',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pharmacy-available.html',
  styleUrls: ['./pharmacy-available.css'],
})
export class PharmacyAvailable {
  private _pharmacies: IPharmaStock[] = [];
  @ViewChild('QuantityInput') el!: ElementRef;
  cartStore = inject(CartStore);

  @Input()
  set pharmacies(value: IPharmaStock[]) {
    console.log('Received pharmacies:', value);
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

  SendToCart(pharmacy: IPharmaStock)
  {
    console.log('Added to cart:', pharmacy.pharma_Name);
    const cartItem: CartItem = {
      drugId: this.drug!.drugID,
      pharmacyId: pharmacy.pharma_Id,
      drugName: pharmacy.pharma_Name,
      pharmacyName: pharmacy.pharma_Name,
      imageUrl: this.drug!.drug_UrlImg,
      unitPrice: pharmacy.price,
      quantity: parseInt(this.el.nativeElement.value),
      totalPrice: pharmacy.price * parseInt(this.el.nativeElement.value),
    };

    this.cartStore.addToCart(cartItem).subscribe({
      next: (response: any) => {
        console.log('Item added to cart successfully:', response);
      },
      error: (error: any) => {
        console.error('Error adding item to cart:', error);
      }
    });
  }
}
