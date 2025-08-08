import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private nextId = 1;

  // Public getter for toasts
  getToasts = this.toasts.asReadonly();

  /**
   * Show a success toast
   */
  showSuccess(message: string, duration: number = 4000): void {
    this.addToast('success', message, duration);
  }

  /**
   * Show a warning toast
   */
  showWarning(message: string, duration: number = 5000): void {
    this.addToast('warning', message, duration);
  }

  /**
   * Show an error toast
   */
  showError(message: string, duration: number = 6000): void {
    this.addToast('error', message, duration);
  }

  /**
   * Remove a specific toast by ID
   */
  removeToast(id: string): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toasts.set([]);
  }

  /**
   * Add a new toast to the stack
   */
  private addToast(type: Toast['type'], message: string, duration: number): void {
    const toast: Toast = {
      id: `toast-${this.nextId++}`,
      type,
      message,
      duration,
      timestamp: Date.now()
    };

    // Add toast to the beginning of array for top-down stacking
    this.toasts.update(toasts => [toast, ...toasts]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, duration);
    }
  }

  /**
   * Extend toast duration (useful for hover functionality)
   */
  extendToastDuration(id: string, additionalTime: number = 2000): void {
    // This is handled in the component with hover functionality
    // Service just needs to be aware that duration can be extended
  }
}
