import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'client-navbar',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
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
}
