import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { ConfigService } from '../../../../shared/services/config.service';
import { UiState } from '../../../../shared/enums/UIState';
import { Patient } from '../../../../shared/models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  config = inject(ConfigService);
  url = this.config.getApiUrl(this.endPoint.PATIENT_PROFILE);
  urlEdit = this.config.getApiUrl(this.endPoint.PATIENT_PROFILE_EDIT);
  accountId = '';

  isLoading = signal(UiState.Loading);
  profile: Patient | null = null;
  originalProfile: Patient | null = null;
  editMode = signal(false);
  activeTab = signal('personal');

  switchTab(tab: string) {
    console.log('Switching to tab:', tab);
    this.activeTab.set(tab);
  }

  loadProfile() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      console.log('No user data found in localStorage');
      this.isLoading.set(UiState.Error);
      return;
    }

    const userData = JSON.parse(userDataString);
    const token = userData._token;
    if (!token) {
      console.log('No token found in user data');
      this.isLoading.set(UiState.Error);
      return;
    }

    const claims = jwtDecode(token) as Record<string, any>;
    this.accountId =
      claims[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    if (!this.accountId) {
      console.log('No account ID found in token claims');
      this.isLoading.set(UiState.Error);
      return;
    }

    console.log('Making API request for account ID:', this.accountId);
    const params = new HttpParams().set('accountId', this.accountId);
    this.http.get<Patient>(this.url, { params }).subscribe({
      next: (profileData) => {
        console.log('Profile data received:', profileData);
        this.profile = profileData;
        this.originalProfile = { ...profileData };
        this.isLoading.set(UiState.Success);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading.set(UiState.Error);
      },
    });
  }

  toggleEditMode() {
    if (this.editMode()) {
      this.saveProfile();
    } else {
      this.editMode.set(true);
    }
  }

  saveProfile() {
    if (!this.profile) return;

    console.log('Saving profile:', this.profile);
    this.originalProfile = { ...this.profile };
    this.editMode.set(false);

    // Strict required field validation
    if (
      !this.profile?.name ||
      (!this.profile?.gender && this.profile?.gender !== 0) ||
      !this.profile?.dateOfBirth ||
      !this.profile?.country ||
      !this.profile?.address
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    const editedData: Patient = {
      name: this.profile.name,
      gender: this.profile.gender,
      dateOfBirth: this.profile.dateOfBirth,
      country: this.profile.country,
      address: this.profile.address,
      medicalHistory: this.profile.medicalHistory,
      medications: this.profile.medications,
      allergies: this.profile.allergies,
    };

    const urlWithId = `${this.urlEdit}/${this.accountId}`;
    this.http.put(urlWithId, editedData).subscribe({
      next: () => {
        this.originalProfile = { ...editedData };
        this.editMode.set(false);
        this.isLoading.set(UiState.Success);
        alert('Profile updated successfully!');
      },
      error: () => {
        this.isLoading.set(UiState.Error);
        alert('Failed to update profile.');
      },
    });
  }

  cancelEdit() {
    if (this.originalProfile) {
      this.profile = { ...this.originalProfile };
    }
    this.editMode.set(false);
  }
}
