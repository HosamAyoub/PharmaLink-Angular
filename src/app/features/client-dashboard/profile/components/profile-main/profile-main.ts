import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './profile-main.html',
  styleUrl: './profile-main.css',
})
export class ProfileMain {
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
