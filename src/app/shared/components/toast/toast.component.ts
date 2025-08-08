import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="toast toast-{{toast.type}}"
      [class.toast-entering]="isEntering()"
      [class.toast-leaving]="isLeaving()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
    >
      <!-- Icon based on type -->
      <div class="toast-icon">
        <span [innerHTML]="getIcon()"></span>
      </div>

      <!-- Message content -->
      <div class="toast-content">
        <p class="toast-message">{{ toast.message }}</p>
      </div>

      <!-- Close button -->
      <button
        class="toast-close"
        (click)="onClose()"
        aria-label="Close notification"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Progress bar -->
      <div class="toast-progress" [style.animation-duration.ms]="toast.duration" *ngIf="toast.duration && toast.duration > 0"></div>
    </div>
  `,
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() toast!: Toast;
  @Output() remove = new EventEmitter<string>();

  // Make these public for template access
  isEntering = signal(true);
  isLeaving = signal(false);
  private autoRemoveTimeout?: any;
  private isHovered = false;

  ngOnInit() {
    // Remove entering animation class after animation completes
    setTimeout(() => {
      this.isEntering.set(false);
    }, 300);

    // Set up auto-removal if duration is specified
    if (this.toast.duration && this.toast.duration > 0) {
      this.scheduleRemoval();
    }
  }

  ngOnDestroy() {
    if (this.autoRemoveTimeout) {
      clearTimeout(this.autoRemoveTimeout);
    }
  }

  onClose() {
    this.startLeaveAnimation();
  }

  onMouseEnter() {
    this.isHovered = true;
    // Cancel auto-removal on hover
    if (this.autoRemoveTimeout) {
      clearTimeout(this.autoRemoveTimeout);
    }
  }

  onMouseLeave() {
    this.isHovered = false;
    // Resume auto-removal when not hovering
    if (this.toast.duration && this.toast.duration > 0) {
      this.scheduleRemoval(1000); // Give 1 second extra after hover
    }
  }

  private scheduleRemoval(delay: number = this.toast.duration || 4000) {
    this.autoRemoveTimeout = setTimeout(() => {
      if (!this.isHovered) {
        this.startLeaveAnimation();
      }
    }, delay);
  }

  private startLeaveAnimation() {
    this.isLeaving.set(true);
    // Wait for animation to complete before removing
    setTimeout(() => {
      this.remove.emit(this.toast.id);
    }, 300);
  }

  getIcon(): string {
    switch (this.toast.type) {
      case 'success':
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.666 5L7.499 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
      case 'warning':
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 6.667V10M10 13.333H10.008M18.333 10C18.333 14.602 14.602 18.333 10 18.333C5.398 18.333 1.667 14.602 1.667 10C1.667 5.398 5.398 1.667 10 1.667C14.602 1.667 18.333 5.398 18.333 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
      case 'error':
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 7.5L7.5 12.5M7.5 7.5L12.5 12.5M18.333 10C18.333 14.602 14.602 18.333 10 18.333C5.398 18.333 1.667 14.602 1.667 10C1.667 5.398 5.398 1.667 10 1.667C14.602 1.667 18.333 5.398 18.333 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
      default:
        return '';
    }
  }
}
