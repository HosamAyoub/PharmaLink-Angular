import { Component, inject } from '@angular/core';
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
  }
}
