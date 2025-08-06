import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../../services/profile-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-history',
  imports: [FormsModule],
  templateUrl: './medical-history.html',
  styleUrl: './medical-history.css'
})
export class MedicalHistory {
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
