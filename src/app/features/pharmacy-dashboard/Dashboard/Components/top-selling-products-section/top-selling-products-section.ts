import { Component, Input, OnChanges } from '@angular/core';
import { IPharmacyAnalysis, TopSellingProduct } from '../../Interface/pharmacy-analysis-interface';
import { DecimalPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-top-selling-products-section',
  imports: [DecimalPipe, SlicePipe],
  templateUrl: './top-selling-products-section.html',
  styleUrl: './top-selling-products-section.css'
})
export class TopSellingProductsSection implements OnChanges{
  
@Input() pharmacyAnalysis:IPharmacyAnalysis | null = null;
@Input() displaybar: boolean = true;

topSellingProducts:TopSellingProduct [] = this.pharmacyAnalysis?.topSellingProducts || [];
ngOnChanges(): void {
  this.updateTopSellingProducts();
}
updateTopSellingProducts(): void {
  if (this.pharmacyAnalysis) {
    this.topSellingProducts = this.pharmacyAnalysis.topSellingProducts;
  }
}


}
