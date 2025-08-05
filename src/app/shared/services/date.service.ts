import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  /**
   * Format a date to a medium date format (e.g., "Jan 15, 2024")
   */
  formatMediumDate(date: string | Date | null | undefined): string {
    if (!date) return 'Not provided';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * Format a date to a short date format (e.g., "1/15/2024")
   */
  formatShortDate(date: string | Date | null | undefined): string {
    if (!date) return 'Not provided';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US');
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * Format a date to a full date format (e.g., "Monday, January 15, 2024")
   */
  formatFullDate(date: string | Date | null | undefined): string {
    if (!date) return 'Not provided';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * Check if a date is valid
   */
  isValidDate(date: string | Date | null | undefined): boolean {
    if (!date) return false;

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return !isNaN(dateObj.getTime());
    } catch {
      return false;
    }
  }

  /**
   * Calculate age from date of birth
   */
  calculateAge(dateOfBirth: string | Date | null | undefined): number | null {
    if (!this.isValidDate(dateOfBirth)) return null;

    const birthDate =
      typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth!;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
