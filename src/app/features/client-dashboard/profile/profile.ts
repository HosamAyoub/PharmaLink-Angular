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
    ProfileError
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  profileService = inject(ProfileService);
  isLoading = this.profileService.isLoading;
  profile = this.profileService.profile;
  public UiState = UiState;

  loadProfile() {
    this.profileService.loadProfile();
  }

  ngOnInit() {
    console.log('🔥 Profile component initialized');
    this.loadProfile();
  }
}
