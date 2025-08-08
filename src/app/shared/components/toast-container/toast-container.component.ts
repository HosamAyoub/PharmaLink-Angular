import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container" [class.mobile]="isMobile()">
      @for (toast of toastService.getToasts(); track toast.id) {
        <app-toast
          [toast]="toast"
          (remove)="toastService.removeToast($event)"
        ></app-toast>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
      max-height: calc(100vh - 40px);
      overflow: hidden;
      display: flex;
      flex-direction: column-reverse;
    }

    .toast-container.mobile {
      bottom: 20px;
      left: 20px;
      right: 20px;
      display: flex;
      flex-direction: column-reverse;
    }

    .toast-container > * {
      pointer-events: auto;
    }

    /* Mobile breakpoint */
    @media (max-width: 768px) {
      .toast-container {
        bottom: 20px;
        left: 20px;
        right: 20px;
        display: flex;
        flex-direction: column-reverse;
      }
    }

    @media (max-width: 480px) {
      .toast-container {
        left: 10px;
        right: 10px;
        bottom: 10px;
      }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
