import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../../services/profile-service';

@Component({
  selector: 'app-account-settings',
  imports: [],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings {
  profileService = inject(ProfileService);
  activeTab = this.profileService.activeTab;
  editMode = this.profileService.editMode;
  profile = this.profileService.profile;

  cancelEdit() {
    this.profileService.cancelEdit();
  }
  toggleEditMode() {
    this.profileService.toggleEditMode();
  }
}
