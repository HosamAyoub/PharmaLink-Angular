import { Component, inject, HostListener, OnInit } from '@angular/core';
import { ProfileService } from '../../../../services/profile-service';

interface SettingOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-account-settings',
  imports: [],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings implements OnInit {
  profileService = inject(ProfileService);
  activeTab = this.profileService.activeTab;
  editMode = this.profileService.editMode;
  profile = this.profileService.profile;

  isMobile = false;
  isTablet = false;

  // Settings data model
  settings: SettingOption[] = [
    {
      id: 'email-notifications',
      title: 'Email Notifications',
      description: 'Receive updates about your orders and promotions',
      enabled: true,
    },
    {
      id: 'sms-notifications',
      title: 'SMS Notifications',
      description: 'Get SMS alerts for order status updates',
      enabled: false,
    },
    {
      id: 'privacy-mode',
      title: 'Privacy Mode',
      description: 'Hide your profile from other users',
      enabled: false,
    },
    {
      id: 'two-factor-auth',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: false,
    },
    {
      id: 'marketing-emails',
      title: 'Marketing Emails',
      description: 'Receive promotional offers and health tips',
      enabled: true,
    },
  ];

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
    this.isTablet = width > 768 && width <= 1024;
  }

  toggleSetting(settingId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const setting = this.settings.find((s) => s.id === settingId);

    if (setting) {
      setting.enabled = target.checked;

      // Provide haptic feedback on mobile devices if available
      if ('vibrate' in navigator && this.isMobile) {
        navigator.vibrate(30);
      }

      // Save settings to service or backend
      this.saveSettings();
    }
  }

  private saveSettings() {
    // Here you would typically save to a backend service
    console.log('Settings saved:', this.settings);

    // You could integrate with the ProfileService to persist settings
    // this.profileService.updateSettings(this.settings);
  }

  cancelEdit() {
    this.profileService.cancelEdit();
  }

  toggleEditMode() {
    this.profileService.toggleEditMode();
  }

  // Helper method to get setting by ID
  getSettingById(id: string): SettingOption | undefined {
    return this.settings.find((setting) => setting.id === id);
  }

  // Helper method to check if all settings are disabled (for UI purposes)
  areAllSettingsDisabled(): boolean {
    return this.settings.every((setting) => !setting.enabled);
  }

  // Helper method to get enabled settings count
  getEnabledSettingsCount(): number {
    return this.settings.filter((setting) => setting.enabled).length;
  }

  // Method to reset all settings to default
  resetToDefaults() {
    this.settings.forEach((setting) => {
      switch (setting.id) {
        case 'email-notifications':
        case 'marketing-emails':
          setting.enabled = true;
          break;
        default:
          setting.enabled = false;
          break;
      }
    });

    this.saveSettings();

    if ('vibrate' in navigator && this.isMobile) {
      navigator.vibrate([50, 50, 50]);
    }
  }
}
