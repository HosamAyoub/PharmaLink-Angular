import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../../services/profile-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-history',
  imports: [FormsModule],
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.css'
})
export class OrdersHistory {
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
