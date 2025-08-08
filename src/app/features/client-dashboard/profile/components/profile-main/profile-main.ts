import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PersonalInfo } from './components/personal-info/personal-info';
import { MedicalHistory } from './components/medical-history/medical-history';
import { OrdersHistory } from './components/orders-history/orders-history';
import { AccountSettings } from './components/account-settings/account-settings';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    PersonalInfo,
    MedicalHistory,
    OrdersHistory,
    AccountSettings,
    AccountSettings,
  ],
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
