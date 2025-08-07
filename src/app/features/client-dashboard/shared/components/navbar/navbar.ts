import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../profile/services/profile-service';

@Component({
  selector: 'client-navbar',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  switchTab(tab: string) {
    this.profileService.switchTab(tab);
  }
  // private subscription!: Subscription;
  // isAuthenticated = false;

  // ngOnInit() {
  //   this.subscription = this.authService.user.subscribe((user) => {
  //     this.isAuthenticated = Boolean(user);
  //   });
  // }
  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
  get isAuthenticated() {
    return Boolean(this.authService.user());
  }
  onLogout() {
    this.authService.logout();
  }
  LoggedUserName = computed(() => this.authService.user()?.userName);
}
