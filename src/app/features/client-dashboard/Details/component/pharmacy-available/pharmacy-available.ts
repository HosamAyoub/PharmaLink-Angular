import { Component, Input, ChangeDetectorRef, inject, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../Cart/Services/cart-service';
import {CartUpdateDto} from '../../../Cart/Interfaces/cart-update-dto';
import { ViewChild } from '@angular/core';
import { IPharmaStock } from '../../model/IPharmaDrug';

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
  cartservice = inject(CartService);

  @Input()
  set pharmacies(value: IPharmaStock[]) {
    console.log('Received pharmacies:', value);
    this._pharmacies = value;
    setTimeout(() =>
    {
      this.cdr.detectChanges();
    });
  }

  @Input() drugId: number = 0;

  get pharmacies() {
    return this._pharmacies;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  SendToCart(pharmacy: IPharmaStock)
  {
    console.log('Added to cart:', pharmacy.pharma_Name);
    this.cartservice.addToCart({
      drugId: this.drugId,
      pharmacyId: pharmacy.pharma_Id,
      quantity: parseInt(this.el.nativeElement.value)
    } as CartUpdateDto).subscribe({
      next: (response) => {
        console.log('Item added to cart successfully:', response);
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
      }
    });
  }
}
