import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CartStore } from '../../../Cart/Services/cart-store';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../profile/services/profile-service';
import { SignalrService } from '../../services/signalr.service';

@Component({
  selector: 'client-navbar',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public signalrService = inject(SignalrService)
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
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

  onLogout() {
    this.authService.logout();
  }

  LoggedUserName = computed(() => this.authService.user()?.userName);
}
