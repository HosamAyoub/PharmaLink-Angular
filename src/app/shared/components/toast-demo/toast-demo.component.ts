import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-demo">
      <h2>🍞 Toast Notification Demo</h2>
      <p>Test the different types of toast notifications:</p>

      <div class="demo-buttons">
        <button
          class="demo-btn success"
          (click)="showSuccessToast()"
        >
          ✅ Show Success Toast
        </button>

        <button
          class="demo-btn warning"
          (click)="showWarningToast()"
        >
          ⚠️ Show Warning Toast
        </button>

        <button
          class="demo-btn error"
          (click)="showErrorToast()"
        >
          ❌ Show Error Toast
        </button>

        <button
          class="demo-btn multiple"
          (click)="showMultipleToasts()"
        >
          🚀 Show Multiple Toasts
        </button>

        <button
          class="demo-btn clear"
          (click)="clearAllToasts()"
        >
          🗑️ Clear All Toasts
        </button>
      </div>

      <div class="demo-examples">
        <h3>Usage Examples:</h3>
        <div class="code-example">
          <code>toastService.showSuccess("Medicine added successfully!")</code>
        </div>
        <div class="code-example">
          <code>toastService.showWarning("Please login to continue")</code>
        </div>
        <div class="code-example">
          <code>toastService.showError("Failed to load data")</code>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-demo {
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h2 {
      color: #333;
      margin-bottom: 10px;
    }

    p {
      color: #666;
      margin-bottom: 30px;
    }

    .demo-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 40px;
    }

    .demo-btn {
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 160px;
    }

    .demo-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .demo-btn.success {
      background: #22c55e;
      color: white;
    }

    .demo-btn.warning {
      background: #f59e0b;
      color: white;
    }

    .demo-btn.error {
      background: #ef4444;
      color: white;
    }

    .demo-btn.multiple {
      background: #8b5cf6;
      color: white;
    }

    .demo-btn.clear {
      background: #6b7280;
      color: white;
    }

    .demo-examples {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    h3 {
      color: #374151;
      margin-bottom: 15px;
    }

    .code-example {
      background: #1f2937;
      color: #f9fafb;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 10px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    @media (max-width: 768px) {
      .toast-demo {
        margin: 20px;
        padding: 15px;
      }

      .demo-buttons {
        flex-direction: column;
      }

      .demo-btn {
        width: 100%;
        min-width: unset;
      }
    }
  `]
})
export class ToastDemoComponent {
  private toastService = inject(ToastService);

  showSuccessToast() {
    this.toastService.showSuccess('Medicine added to cart successfully! 💊');
  }

  showWarningToast() {
    this.toastService.showWarning('Please login to add items to your cart ⚠️');
  }

  showErrorToast() {
    this.toastService.showError('Failed to connect to server. Please try again ❌');
  }

  showMultipleToasts() {
    setTimeout(() => this.toastService.showSuccess('First toast! 🥇'), 0);
    setTimeout(() => this.toastService.showWarning('Second toast! 🥈'), 200);
    setTimeout(() => this.toastService.showError('Third toast! 🥉'), 400);
    setTimeout(() => this.toastService.showSuccess('Stack them up! 📚'), 600);
  }

  clearAllToasts() {
    this.toastService.clearAll();
  }
}
