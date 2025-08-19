import { Component, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { UiState } from '../../../shared/enums/UIState';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css',
})
export class EmailConfirmationComponent implements OnInit {
  statusMessage = signal<string>('Confirming your email...');
  isSuccess = signal<boolean | null>(null);
  public state = signal<UiState>(UiState.Loading);
  public UiStateType = UiState;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (userId && token) {
      // Call backend API
      this.authService.confirmEmail(userId, token).subscribe({
        next: (res) => {
          this.state.set(UiState.Success);
          this.isSuccess.set(true);
          this.statusMessage.set(
            '✅ Your email has been successfully confirmed!'
          );
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); // 2 seconds delay
        },
        error: (err) => {
          this.state.set(UiState.Error);
          this.isSuccess.set(false);
          this.statusMessage.set(
            '❌ Email confirmation failed. The link may be invalid or expired.'
          );
        },
      });
    } else {
      this.isSuccess.set(false);
      this.statusMessage.set('❌ Invalid confirmation link.');
    }
  }
}
