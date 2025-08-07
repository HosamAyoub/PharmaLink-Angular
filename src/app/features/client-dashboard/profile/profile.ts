import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ProfileHeader } from './components/profile-header/profile-header';
import { ProfileNavbar } from './components/profile-navbar/profile-navbar';
import { ProfileService } from './services/profile-service';
import { ProfileMain } from './components/profile-main/profile-main';
import { UiState } from '../../../shared/enums/UIState';
import { ProfileError } from './components/profile-error/profile-error';
import { FormState } from '../../../shared/enums/FormState';
import { Alert } from '../../../shared/components/alert/alert';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LoadingSpinner,
    ProfileHeader,
    ProfileNavbar,
    ProfileMain,
    ProfileError,
    Alert,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  profileService = inject(ProfileService);
  isLoading = this.profileService.isLoading;
  profile = this.profileService.profile;
  alertState = this.profileService.alertState;
  alertMessage = this.profileService.alertMessage;
  public UiState = UiState;
  public FormState = FormState;

  loadProfile() {
    this.profileService.loadProfile();
  }

  ngOnInit() {
    console.log('🔥 Profile component initialized');
    this.loadProfile();
  }
}
