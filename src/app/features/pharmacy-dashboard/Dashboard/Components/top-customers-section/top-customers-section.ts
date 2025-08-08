import { TopCustomer } from './../../Interface/pharmacy-analysis-interface';
import { Component, Input } from '@angular/core';
import { IPharmacyAnalysis } from '../../Interface/pharmacy-analysis-interface';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-top-customers-section',
  imports: [SlicePipe],
  templateUrl: './top-customers-section.html',
  styleUrl: './top-customers-section.css'
})
export class TopCustomersSection {
@Input() pharmacyAnalysis:IPharmacyAnalysis | null = null;

topCustomers:TopCustomer [] = this.pharmacyAnalysis?.topCustomers || [];

ngOnChanges(): void {
  this.updateTopCustomers();
}
updateTopCustomers(): void {
  if (this.pharmacyAnalysis) {
    this.topCustomers = this.pharmacyAnalysis.topCustomers;
  }
}

}
