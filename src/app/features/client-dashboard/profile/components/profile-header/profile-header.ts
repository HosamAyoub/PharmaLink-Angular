import { Component, inject, input, output } from '@angular/core';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.css',
})
export class ProfileHeader {
  profileService = inject(ProfileService);
  profile = this.profileService.profile;
  editMode = this.profileService.editMode;

  toggleEditMode() {
    this.profileService.toggleEditMode();
  }
}
