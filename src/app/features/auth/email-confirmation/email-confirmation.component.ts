import { Component, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent implements OnInit {
  statusMessage = signal<string>("Confirming your email...");
  isSuccess = signal<boolean | null>(null);

  constructor(private route: ActivatedRoute, private http: HttpClient , private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');


    if (userId && token) {
      // Call backend API
      this.authService.confirmEmail(userId, token).subscribe({
        next: (res) => {
          this.isSuccess.set(true);
          this.statusMessage.set("✅ Your email has been successfully confirmed!");
        },
        error: (err) => {
          console.error('Email confirmation error:', err);
          this.isSuccess.set(false);
          this.statusMessage.set("❌ Email confirmation failed. The link may be invalid or expired.");
        }
      });
    } else {
      this.isSuccess.set(false);
      this.statusMessage.set("❌ Invalid confirmation link.");
    }
  }
}
