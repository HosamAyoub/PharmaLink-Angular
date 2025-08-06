import { Component, Input, OnChanges } from '@angular/core';
import { IPharmacyAnalysis, TopSellingProduct } from '../../Interface/pharmacy-analysis-interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-top-selling-products-section',
  imports: [DecimalPipe],
  templateUrl: './top-selling-products-section.html',
  styleUrl: './top-selling-products-section.css'
})
export class TopSellingProductsSection implements OnChanges{
  
@Input() pharmacyAnalysis:IPharmacyAnalysis | null = null;

topSellingProducts:TopSellingProduct [] = this.pharmacyAnalysis?.topSellingProducts || [];
ngOnChanges(): void {
  // This method will be called whenever the input property changes
  this.updateTopSellingProducts();
}
updateTopSellingProducts(): void {
  if (this.pharmacyAnalysis) {
    this.topSellingProducts = this.pharmacyAnalysis.topSellingProducts;
  }
}


}
