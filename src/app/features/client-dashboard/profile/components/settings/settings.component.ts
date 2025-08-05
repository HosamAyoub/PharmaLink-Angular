import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingSpinner } from '../../../../../shared/components/loading-spinner/loading-spinner';

interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  privacyMode: boolean;
  twoFactorAuth: boolean;
  newsletter: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, LoadingSpinner],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  isLoading = signal(false);
  isSaving = signal(false);

  settings: UserSettings = {
    emailNotifications: true,
    smsNotifications: false,
    privacyMode: false,
    twoFactorAuth: false,
    newsletter: true,
  };

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      // Mock settings data
      this.settings = {
        emailNotifications: true,
        smsNotifications: false,
        privacyMode: false,
        twoFactorAuth: false,
        newsletter: true,
      };
      this.isLoading.set(false);
    }, 500);
  }

  saveSettings() {
    this.isSaving.set(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Settings saved:', this.settings);
      this.isSaving.set(false);
      // You could show a success message here
    }, 1000);
  }
}
