import { Component, inject, HostListener } from '@angular/core';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-profile-navbar',
  imports: [],
  templateUrl: './profile-navbar.html',
  styleUrl: './profile-navbar.css',
})
export class ProfileNavbar {
  profileService = inject(ProfileService);
  activeTab = this.profileService.activeTab;

  switchTab(tab: string) {
    this.profileService.switchTab(tab);

    // Provide haptic feedback on mobile devices if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Handle any resize-specific logic if needed
    // This can be useful for dynamic adjustments
  }
}
