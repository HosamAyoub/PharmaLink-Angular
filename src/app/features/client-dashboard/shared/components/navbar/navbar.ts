import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CartStore } from '../../../Cart/Services/cart-store';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { ProfileService } from '../../../profile/services/profile-service';
import { SharedService } from '../../services/shared-service';

@Component({
  selector: 'client-navbar',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private sharedService = inject(SharedService);
  private router = inject(Router);


  searchQuery: string = '';
  showResults: boolean = false;
  drugs = signal<any[]>([]);
  pharmacies = signal<any[]>([]);

  switchTab(tab: string) {
    this.profileService.switchTab(tab);
  }
  private cartStore = inject(CartStore);

  // Computed properties for reactive updates
  cartItemCount = computed(() => {
    const items = this.cartStore.cartItems();
    // Return the number of unique items (different products), not total quantity
    return items.length;
  });

  // Display cart count with 99+ limit for UI
  cartDisplayCount = computed(() => {
    const count = this.cartItemCount();
    return count > 99 ? '99+' : count.toString();
  });

  get isAuthenticated() {
    return Boolean(this.authService.user());
  }

  onSearch(query: string) {
    this.searchQuery = query;
    if (query.trim().length > 0) {
      this.getDrugsAndPharmacies(query);
    } else {
      this.drugs.set([]);
      this.pharmacies.set([]);
      this.showResults = false;
    }
  }

  getDrugsAndPharmacies(searchTerm: string) {
    this.sharedService.getDrugsAndPharmacies(searchTerm).pipe(
    ).subscribe((response: any) => {
      this.drugs.set(response.drugs || []);
      this.pharmacies.set(response.pharmacies || []);
  this.showResults = true;
    });
  }

  onSearchFocus() {
    this.showResults = true;
  }

  onSearchBlur() {
    setTimeout(() => {
      this.showResults = false;
    }, 500);
  }

  onSelect(item: any) {
    console.log('Selected item:', item);
    this.searchQuery = item.name;
    this.showResults = false;
    // Add navigation logic here based on item type
  }

  onSelectDrug(Id: string) {
    console.log('onSelectDrug called with ID:', Id);
    console.log('Navigate to drug details:', Id);
    // Navigate to drug details page
    this.router.navigate(['/client/DrugDetails', Id]);
    this.showResults = false;
  }

  onSelectPharmacy(Id: string) {
    console.log('onSelectPharmacy called with ID:', Id);
    console.log('Navigate to pharmacy products:', Id);
    // Navigate to pharmacy stock/products page
    this.router.navigate(['/client/pharmacyStock', Id]);
    this.showResults = false;
  }

  onSeeMoreDrugs() {
    console.log('Navigate to drugs page with search:', this.searchQuery);
    // Navigate to products/drugs page with search query
    this.router.navigate(['/client/products'], { queryParams: { search: this.searchQuery } });
    this.showResults = false;
  }

  onSeeMorePharmacies() {
    console.log('Navigate to pharmacies page with search:', this.searchQuery);
    // Navigate to pharmacies page with search query
    this.router.navigate(['/client/pharmacies'], { queryParams: { search: this.searchQuery } });
    this.showResults = false;
  }

  onLogout() {
    this.authService.logout();
  }

  LoggedUserName = computed(() => this.authService.user()?.userName);
}
