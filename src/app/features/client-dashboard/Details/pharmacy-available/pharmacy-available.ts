import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPharmaStock } from '../../../../core/drug/IPharmaDrug';

@Component({
  selector: 'app-pharmacy-available',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pharmacy-available.html',
  styleUrls: ['./pharmacy-available.css'],
})
export class PharmacyAvailable {
  private _pharmacies: IPharmaStock[] = [];

  @Input()
  set pharmacies(value: IPharmaStock[]) {
    console.log('Received pharmacies:', value);
    this._pharmacies = value;
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  get pharmacies() {
    return this._pharmacies;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  buyNow(pharmacy: IPharmaStock) {
    console.log('Buying from:', pharmacy.pharma_Name);
  }
}
