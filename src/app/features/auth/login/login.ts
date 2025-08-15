import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-login',
  imports: [LoadingSpinner, FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLoading = signal(false);
  displayedError = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Helper methods for field validation - only show errors when user leaves the field
  isEmailInvalid(emailField: any): boolean {
    return emailField?.invalid && emailField?.touched;
  }

  isPasswordInvalid(passwordField: any): boolean {
    return passwordField?.invalid && passwordField?.touched;
  }

  getEmailErrorMessage(emailField: any): string {
    if (emailField?.errors?.['required']) {
      return 'Email is required';
    }
    if (emailField?.errors?.['email']) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(passwordField: any): string {
    if (passwordField?.errors?.['required']) {
      return 'Password is required';
    }
    if (passwordField?.errors?.['minlength']) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading.set(true);
    const email = form.value.email;
    const password = form.value.password;
    const rememberMe = Boolean(form.value.rememberMe);
    this.authService.login(email, password, rememberMe).subscribe({
      next: (resData) => {
        this.isLoading.set(false);
        form.reset();

        const role = resData.value.role;

        // Check for return URL first, then redirect based on role
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        
        let redirectUrl = '/client/home'; // default for client
        if (role == 'Admin') {
          redirectUrl = '/admin/home';
        } else if (role == 'Pharmacy') {
          redirectUrl = '/pharmacy/dashboard';
        }

        // Use return URL if provided, otherwise use role-based redirect
        const finalUrl = returnUrl || redirectUrl;
        this.router.navigate([finalUrl]);
      },
      error: (error) => {
        this.displayedError = this.getErrorMessage(error);
        this.isLoading.set(false);
      },
    });
  }

  clearError() {
    this.displayedError = '';
  }

  private getErrorMessage(error: any): string {

    // Check for specific authentication errors
    if (error.status === 401 || error.status === 400) {
      // Common authentication failure statuses
      return 'Invalid email or password. Please try again.';
    } else if (error.status === 403) {
      return 'Account is locked. Please contact support.';
    } else if (error.status === 422) {
      // Validation errors
      if (error.error && error.error.errors) {
        const validationErrors = Object.values(error.error.errors).flat();
        return validationErrors.join('. ');
      }
      return 'Please check your input and try again.';
    } else if (error.status === 0) {
      return 'Unable to connect to server. Please check your internet connection.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'Invalid email or password. Please try again.';
    }
  }
}
