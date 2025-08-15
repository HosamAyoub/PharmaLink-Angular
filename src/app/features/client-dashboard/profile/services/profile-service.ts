import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { ConfigService } from '../../../../shared/services/config.service';
import { UiState } from '../../../../shared/enums/UIState';
import { Patient } from '../../../../shared/models/user.model';
import { jwtDecode } from 'jwt-decode';
import { FormState } from '../../../../shared/enums/FormState';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  config = inject(ConfigService);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  url = this.config.getApiUrl(this.endPoint.PATIENT_PROFILE);
  urlEdit = this.config.getApiUrl(this.endPoint.PATIENT_PROFILE_EDIT);
  accountId = '';

  isLoading = signal(UiState.Loading);
  profile = signal<Patient | null>(null);
  originalProfile = signal<Patient | null>(null);
  editMode = signal(false);
  activeTab = signal('personal');
  alertState = signal(FormState.Hide);
  alertTimeout: any = null;
  alertMessage = signal<string>('');

  constructor() {
    effect(() => {
      if (this.alertState() !== FormState.Hide) {
        if (this.alertTimeout) {
          clearTimeout(this.alertTimeout);
        }
        this.alertTimeout = setTimeout(() => {
          this.alertState.set(FormState.Hide);
          this.alertTimeout = null;
        }, 2000);
      }
    });
  }

  switchTab(tab: string) {
    this.activeTab.set(tab);
  }

  loadProfile() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      this.isLoading.set(UiState.Error);
      return;
    }

    const userData = JSON.parse(userDataString);
    const token = userData._token;
    if (!token) {
      this.isLoading.set(UiState.Error);
      return;
    }

    const claims = jwtDecode(token) as Record<string, any>;
    this.accountId =
      claims[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    if (!this.accountId) {
      this.isLoading.set(UiState.Error);
      return;
    }

    const params = new HttpParams().set('accountId', this.accountId);
    this.http.get<Patient>(this.url, { params }).subscribe({
      next: (profileData) => {
        this.profile.set(profileData);
        this.originalProfile.set(profileData);
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
    if (!this.profile()) return;

    // Strict required field validation
    if (
      !this.profile()?.name ||
      (!this.profile()?.gender && this.profile()?.gender !== 0) ||
      !this.profile()?.dateOfBirth ||
      !this.profile()?.country ||
      !this.profile()?.address
    ) {
      this.alertState.set(FormState.Required);
      this.alertMessage.set('Please fill in all required fields.');
      return;
    }

    this.originalProfile.set(this.profile());
    this.editMode.set(false);

    const editedData: Patient = {
      name: this.profile()!.name,
      gender: this.profile()!.gender,
      dateOfBirth: this.profile()!.dateOfBirth,
      country: this.profile()!.country,
      address: this.profile()?.address,
      medicalHistory: this.profile()?.medicalHistory,
      medications: this.profile()?.medications,
      allergies: this.profile()?.allergies,
    };


    const urlWithId = `${this.urlEdit}/${this.accountId}`;
    this.http.put(urlWithId, editedData).subscribe({
      next: () => {
        this.originalProfile.set(editedData);
        this.editMode.set(false);
        this.isLoading.set(UiState.Success);
        this.alertState.set(FormState.Success);

        this.alertMessage.set('Profile updated successfully!');
      },
      error: () => {
        this.isLoading.set(UiState.Error);
        this.alertMessage.set('Failed to update profile.');
        this.alertState.set(FormState.Failed);
      },
    });
  }

  cancelEdit() {
    if (this.originalProfile) {
      this.profile.set(this.originalProfile());
    }
    this.editMode.set(false);
  }
}
