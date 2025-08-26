import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../../../services/profile-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  imports: [FormsModule, DatePipe],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css',
})
export class PersonalInfo implements OnInit, OnDestroy {
  profileService = inject(ProfileService);
  activeTab = this.profileService.activeTab;
  editMode = this.profileService.editMode;
  profile = this.profileService.profile;

  // Mobile-specific properties
  isMobile: boolean = false;
  isTablet: boolean = false;
  screenWidth: number = window.innerWidth;
  private resizeListener?: () => void;

  ngOnInit() {
    this.checkScreenSize();
    this.setupWindowResize();
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  /**
   * Check current screen size and set responsive flags
   */
  private checkScreenSize(): void {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth < 768;
    this.isTablet = this.screenWidth >= 768 && this.screenWidth < 1024;
  }

  /**
   * Setup window resize listener for responsive behavior
   */
  private setupWindowResize(): void {
    this.resizeListener = () => {
      this.checkScreenSize();
    };
    window.addEventListener('resize', this.resizeListener);
  }

  /**
   * Toggle edit mode with mobile-specific haptic feedback
   */
  toggleEditMode(): void {
    // Add haptic feedback for mobile devices
    if (this.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    this.profileService.toggleEditMode();
  }

  /**
   * Save changes with mobile haptic feedback
   */
  saveChanges(): void {
    // Add haptic feedback for mobile
    if (this.isMobile && 'vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }

    // Here you would typically validate and save
    // For now, just toggle edit mode
    this.profileService.toggleEditMode();
  }

  /**
   * Get responsive button text based on screen size
   */
  getButtonText(action: 'edit' | 'save' | 'cancel'): string {
    if (this.isMobile) {
      const mobileTexts = {
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
      };
      return mobileTexts[action];
    }

    const fullTexts = {
      edit: 'Edit Profile',
      save: 'Save Changes',
      cancel: 'Cancel',
    };
    return fullTexts[action];
  }

  /**
   * Handle input focus for mobile optimization
   */
  onInputFocus(event: Event): void {
    const input = event.target as HTMLInputElement;

    // On mobile, scroll input into view
    if (this.isMobile) {
      setTimeout(() => {
        input.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300); // Wait for virtual keyboard
    }
  }

  /**
   * Get CSS classes for responsive behavior
   */
  getResponsiveClasses(): string {
    const classes: string[] = ['personal-info-container'];

    if (this.isMobile) {
      classes.push('mobile-layout');
    }

    if (this.isTablet) {
      classes.push('tablet-layout');
    }

    if (this.editMode()) {
      classes.push('edit-mode');
    }

    return classes.join(' ');
  }
}
