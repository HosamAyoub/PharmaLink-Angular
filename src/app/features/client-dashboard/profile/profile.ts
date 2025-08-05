import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';
import { ConfigService } from '../../../shared/services/config.service';
import { Patient } from '../../../shared/models/user.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe, LoadingSpinner],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private http = inject(HttpClient);
  private endPoint = APP_CONSTANTS.API.ENDPOINTS;
  private config = inject(ConfigService);
  private url = this.config.getApiUrl(this.endPoint.PATIENT_PROFILE);
  private urlEdit = this.config.getApiUrl(this.endPoint.PATIENT_PROFILE_EDIT);
  private accountId = '';

  isLoading = signal(false);
  profile: Patient | null = null;
  originalProfile: Patient | null = null;
  editMode = false;
  activeTab = signal('personal');

  constructor() {
    console.log('🚀 Profile component constructor called');
  }

  ngOnInit() {
    console.log('🔥 Profile component initialized');
    this.loadProfile();
  }

  switchTab(tab: string) {
    console.log('Switching to tab:', tab);
    this.activeTab.set(tab);
  }

  loadProfile() {
    console.log('Loading profile...');
    this.isLoading.set(true);
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      console.log('No user data found in localStorage');
      this.isLoading.set(false);
      return;
    }

    const userData = JSON.parse(userDataString);
    const token = userData._token;
    if (!token) {
      console.log('No token found in user data');
      this.isLoading.set(false);
      return;
    }

    const claims = jwtDecode(token) as Record<string, any>;
    this.accountId =
      claims[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    if (!this.accountId) {
      console.log('No account ID found in token claims');
      this.isLoading.set(false);
      return;
    }

    console.log('Making API request for account ID:', this.accountId);
    const params = new HttpParams().set('accountId', this.accountId);
    this.http.get<Patient>(this.url, { params }).subscribe({
      next: (profileData) => {
        console.log('Profile data received:', profileData);
        this.profile = profileData;
        this.originalProfile = { ...profileData };
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading.set(false);
      },
    });
  }

  toggleEditMode() {
    if (this.editMode) {
      this.saveProfile();
    } else {
      this.editMode = true;
    }
  }

  saveProfile() {
    if (!this.profile) return;

    console.log('Saving profile:', this.profile);
    this.originalProfile = { ...this.profile };
    this.editMode = false;

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
        this.editMode = false;
        this.isLoading.set(false);
        alert('Profile updated successfully!');
      },
      error: () => {
        this.isLoading.set(false);
        alert('Failed to update profile.');
      },
    });
  }

  cancelEdit() {
    if (this.originalProfile) {
      this.profile = { ...this.originalProfile };
    }
    this.editMode = false;
  }
}
