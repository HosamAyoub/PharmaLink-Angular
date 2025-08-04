import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-details-modal',
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './order-details-modal.html',
  styleUrl: './order-details-modal.css'
})
export class OrderDetailsModal {
  @Input() orderDetails: any;
  @Input() visible: boolean = false;
  @Input() close!: () => void;

  getProgress(status: string): number {
    switch (status) {
      case 'Reviewing': return 25;
      case 'Pending': return 50;
      case 'OutForDelivery': return 75;
      case 'Delivered': return 100;
      case 'Rejected': return 100;
      default: return 0;
    }
  }

  getProgressColor(status: string): string {
    switch (status) {
      case 'Delivered': return 'bg-blue-navbar';
      case 'OutForDelivery': return 'bg-blue-navbar';
      case 'Pending': return 'bg-blue-navbar';
      case 'Reviewing': return 'bg-blue-navbar';
      default: return 'bg-secondary-custom';
    }
  }

  getStepClass(step: string): string {
    const stages = ['Reviewing', 'Pending', 'OutForDelivery', 'Delivered'];
    const currentIndex = stages.indexOf(this.orderDetails?.currentStatus || '');
    const stepIndex = stages.indexOf(step);

    if (stepIndex < currentIndex) return 'text-success-green';
    if (stepIndex === currentIndex) return 'text-blue-navbar fw-bold';
    return 'text-muted';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Reviewing':
        return 'bg-purple-custom text-white';
      case 'Pending':
        return 'bg-warning-custom text-dark';
      case 'OutForDelivery':
        return 'bg-orange-custom text-white';
      case 'Delivered':
        return 'bg-success-green text-white';
      case 'Rejected':
        return 'bg-error-red text-white';
      default:
        return 'bg-secondary-custom text-white';
    }
  }

  getTimeDisplay(status: string): string {
    switch (status) {
      case 'UnderReview': return '10';
      case 'Reviewing': return '15';
      case 'Pending': return '30';
      case 'OutForDelivery': return '';
      case 'Delivered': return '';
      case 'Rejected': return '';
      default: return '';
    }
  }
}


