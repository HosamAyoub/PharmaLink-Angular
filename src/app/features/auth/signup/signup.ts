import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  isLoading = signal(false);
  displayedError = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading.set(true);

    const userName = form.value.userName;
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    const phoneNumber = form.value.phoneNumber || '1234567890'; // Provide default if empty

    this.authService.signUp(userName, email, password, phoneNumber).subscribe({
      next: (resData) => {
        console.log(resData);
        this.isLoading.set(false);
        form.reset();
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
