import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { ResponseData, User } from '../../core/auth/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, LoadingSpinner],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class Auth {
  isLoginMode = true;
  isLoading = signal(false);
  displayedError = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  // userModel = inject(User);

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading.set(true);

    if (this.isLoginMode) {
      const email = form.value.email;
      const password = form.value.password;
      this.authService.login(email, password).subscribe({
        next: (resData) => {
          console.log(resData);
          this.isLoading.set(false);
          form.reset();
          this.router.navigate(['/client/home']);
          // console.log(this.userModel.token);
          // console.log(resData.value.expiration > new Date());
        },
        error: (error) => {
          console.log('error');
          console.log(error);
          this.displayedError = 'An error occurred!';
          this.isLoading.set(false);
        },
      });
    } else {
      const email = form.value.email;
      const userName = form.value.userName;
      const password = form.value.password;
      const phoneNumber = form.value.phoneNumber || '1234567890'; // Provide default if empty
      this.authService
        .signUp(userName, email, password, phoneNumber)
        .subscribe({
          next: (resData) => {
            console.log(resData);
            this.isLoading.set(false);
            form.reset();
            this.onSwitchMode();
            this.router.navigate(['/auth']);
          },
          error: (error) => {
            console.log('❌ Signup error details:');
            console.log('Full error object:', error);
            console.log('Error status:', error.status);
            console.log('Error body:', error.error);

            // Show the specific validation errors
            if (error.error && error.error.errors) {
              console.log('🚨 Validation errors:', error.error.errors);

              // Extract first validation error for display
              const errors = error.error.errors;
              const firstError = Object.values(errors)[0];
              this.displayedError = Array.isArray(firstError)
                ? firstError[0]
                : firstError;
            } else if (error.error && error.error.title) {
              this.displayedError = error.error.title;
            } else {
              this.displayedError = `Error ${error.status}: Registration failed`;
            }

            this.isLoading.set(false);
          },
        });
    }
  }
}
