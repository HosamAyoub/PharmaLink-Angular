import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-profile-error',
  imports: [],
  templateUrl: './profile-error.html',
  styleUrl: './profile-error.css',
})
export class ProfileError {
  profileService = inject(ProfileService);

  loadProfile() {
    this.profileService.loadProfile();
  }
}
