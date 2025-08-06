import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../../services/profile-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  imports: [FormsModule, DatePipe],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css',
})
export class PersonalInfo {
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
