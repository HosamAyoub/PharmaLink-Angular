import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.css',
})
export class ProfileHeader {
  profileService = inject(ProfileService);
  profile = this.profileService.profile;
  editMode = this.profileService.editMode;

  private elementRef = inject(ElementRef);
  isMobile = false;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleEditMode() {
    this.profileService.toggleEditMode();

    // Provide haptic feedback on mobile devices if available
    if ('vibrate' in navigator && this.isMobile) {
      navigator.vibrate(50);
    }

    // Smooth scroll to top on mobile when editing starts
    if (this.editMode() && this.isMobile) {
      this.elementRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  // Helper method to get responsive avatar text
  getAvatarText(): string {
    const name = this.profile()?.name || 'U';
    return name.charAt(0).toUpperCase();
  }

  // Helper method to format location text for mobile
  getLocationText(): string {
    const country = this.profile()?.country || 'Country';
    const address = this.profile()?.address || 'Address';

    if (this.isMobile && country.length + address.length > 30) {
      return `${country.substring(0, 15)}...`;
    }

    return `${country}, ${address}`;
  }

  /**
   * Cancel editing with confirmation on mobile if form is dirty
   */
  cancelEdit(): void {
    // On mobile, show confirmation for better UX
    if (this.isMobile && this.editMode()) {
      const confirmed = confirm(
        'Are you sure you want to discard your changes?'
      );
      if (!confirmed) return;
    }

    // Add haptic feedback
    if (this.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }

    this.profileService.cancelEdit();
  }
}
