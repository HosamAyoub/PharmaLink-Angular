import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PharmacyCard } from "../../../shared/components/pharmacy-card/pharmacy-card";
import { single } from 'rxjs';
import { Ipharmacy } from '../../../shared/models/ipharmacy';
import { PharmacyService } from '../../../Pharmacies/Service/pharmacy-service';
import { PharmacyProductsService } from '../../services/pharamcy-products-service';
import { SideBar } from "../../../shared/components/side-bar/side-bar";
import { IDrug } from '../../../Categories_Page/models/IDrug';
import { Product } from "../../../shared/components/product/product";
import { IProduct } from '../../../shared/models/IProduct';
import { UiState } from '../../../../../shared/enums/UIState';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from "../../../../../shared/components/loading-spinner/loading-spinner";
import { ErrorHandling } from "../../../../../shared/components/error-handling/error-handling";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'client-pharmacy-stock',
  imports: [CommonModule, PharmacyCard, SideBar, Product, LoadingSpinner, ErrorHandling],
  templateUrl: './pharmacy-stock.html',
  styleUrl: './pharmacy-stock.css'
})
export class PharmacyStock {
  pharmacyService = inject(PharmacyProductsService);
  private router = inject(Router);
  pharmacyId = signal<number>(0);
  // Signal to hold pharmacy details
  pharmacyDetails = signal<Ipharmacy>({} as Ipharmacy);
  // Signal to hold pharmacy products
  pharmacyProducts = signal<IProduct[]>([]);

  public UiState = UiState;

  uiState = signal<UiState>(UiState.Loading);
  httpError = signal<HttpErrorResponse | null>(null);
  selectedCategory:string = '';

  // Pagination signals
  pageSize = signal<number>(12);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);




  // Change page
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadPharmacyProducts();
    }
  }

  constructor(public route: ActivatedRoute) {
    // Get pharmacyId from route params
    route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.pharmacyId.set(id);
        this.loadPharmacy();
        this.loadPharmacyProducts();
      } else {
        console.warn('Pharmacy ID is not set in route');
      }
    });


  }

  loadPharmacy() {
    if (this.pharmacyId()) {
      this.pharmacyService.getPharmacy(this.pharmacyId()).subscribe({
        next: (data) => {
          this.uiState.set(UiState.Success);
          this.pharmacyDetails.set(data);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching pharmacy data:', error);
          this.httpError.set(error);
          this.uiState.set(UiState.Error);
        }
      });
    } else {
      console.warn('Pharmacy ID is not set');
    }
  }

  loadPharmacyProducts() {
    if (this.pharmacyId()) {
      this.pharmacyService.getPharmacyProducts(this.pharmacyId(), this.currentPage(), this.pageSize()).subscribe({
        next: (response) => {
          if(response.success) {
            this.uiState.set(UiState.Success);
            this.pharmacyProducts.set(response.data.items);
            this.totalPages.set(response.data.totalPages);
          }
          else{
            console.error('Failed to load pharmacy products:', response.errors);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.httpError.set(error);
          this.uiState.set(UiState.Error);
          console.error('Error fetching pharmacy products:', error);
        }
      });
    } else {
      console.warn('Pharmacy ID is not set');
    }
  }

  loadPharmacyProductsByCategory() {
    if (this.pharmacyId() && this.selectedCategory) {
      this.uiState.set(UiState.Loading);
      this.pharmacyService.getPharmacyProductsByCategory(this.pharmacyId(), this.selectedCategory, this.currentPage(), this.pageSize()).subscribe({
        next: (response) => {
          if(response.success) {
            this.uiState.set(UiState.Success);
            this.pharmacyProducts.set(response.data.items);
            this.totalPages.set(response.data.totalPages);
          }
          else{
            console.error('Failed to load pharmacy products by category:', response.errors);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.httpError.set(error);
          this.uiState.set(UiState.Error);
          console.error('Error fetching pharmacy products by category:', error);
        }
      });
    } else {
      console.warn('Pharmacy ID or selected category is not set');
    }
  }

  // Returns array of page numbers for pagination
  public getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  onCategoryNameSelected(category: string) {
    this.selectedCategory = category;
    this.currentPage.set(1); // Reset to first page on category change
    if(this.selectedCategory== '') {
      this.loadPharmacyProducts();
  }
    else {
      this.loadPharmacyProductsByCategory();
    }
  }

  // Navigate to product details page
  navigateToProduct(drugId: number) {
    this.router.navigate(['/client/pharmacyProduct', drugId]);
  }
}
