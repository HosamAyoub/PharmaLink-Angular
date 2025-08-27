import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartStore } from '../../Services/cart-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { APP_CONSTANTS } from '../../../../../shared/constants/app.constants';

@Component({
  selector: 'app-success-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './success-page.html',
  styleUrl: './success-page.css',
})
export class SuccessPage implements OnInit, OnDestroy {
  sessionId!: string;
  pollingSubscription!: Subscription;
  orderData: any;
  status: 'loading' | 'pending' | 'success' | 'error' = 'loading';

  retryCount = 0;
  maxRetries = 2;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cartStore: CartStore
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sessionId = params['session_id'];
      const paymentMethod = params['paymentMethod'];
      this.cartStore.clearCartUI();
      if (paymentMethod === 'cash') {
        this.status = 'success';
        return;
      }

      // Clear cart UI for credit/stripe payments

      if (this.sessionId) {
        this.status = 'pending';
        this.startPolling();
      } else {
        this.status = 'error';
        this.cdr.detectChanges();
        this.router.navigate(['/']);
      }
    });
  }

  startPolling() {
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.http
        .get<any>(
          `${APP_CONSTANTS.environment.apiBaseUrl}/orders/validate-session?sessionId=${this.sessionId}`
        )
        .subscribe({
          next: (res) => {
            this.orderData = res;
            this.status = 'success';
            this.cdr.detectChanges();
            this.pollingSubscription.unsubscribe();
          },
          error: (err) => {
            if (err.status === 404) {
              this.retryCount++;

              if (this.retryCount >= this.maxRetries) {
                this.status = 'error';
                this.cdr.detectChanges();

                this.pollingSubscription.unsubscribe();
              } else {
                this.status = 'pending';
                this.cdr.detectChanges();
              }
            } else {
              this.status = 'error';
              this.cdr.detectChanges();

              this.pollingSubscription.unsubscribe();
            }
          },
        });
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
