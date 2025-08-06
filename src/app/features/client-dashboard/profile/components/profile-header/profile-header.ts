import { Component, inject, input, output } from '@angular/core';
import { Patient } from '../../../../../shared/models/user.model';
import { ConfigService } from '../../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.html',
  styleUrls: ['../../profile.css'],
})
export class ProfileHeader {
  profileService = inject(ProfileService);
  profile = this.profileService.profile;
  editMode = this.profileService.editMode;

  toggleEditMode() {
    this.profileService.toggleEditMode();
  }
}
