import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, CommonModule, LoadingSpinner],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignUp {
  isLoading = signal(false);
  displayedError = '';
  step = 1;

  // Model to persist form data between steps
  formModel: any = {
    name: '',
    userName: '',
    passwordHash: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    country: '',
    address: '',
    patientDiseases: '',
    patientDrugs: '',
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  // Clear error message when user starts typing
  clearError() {
    this.displayedError = '';
  }

  // Password validation methods
  isPasswordStrong(password: string): boolean {
    if (!password || password.length < 6) return false;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasLower && hasUpper && hasNumber && hasSymbol;
  }

  getPasswordRequirements(password: string) {
    return {
      minLength: password.length >= 6,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }

  // Password confirmation validation
  doPasswordsMatch(): boolean {
    return (
      this.formModel.passwordHash &&
      this.formModel.confirmPassword &&
      this.formModel.passwordHash === this.formModel.confirmPassword
    );
  }

  // Username validation (letters, numbers, and underscore)
  isUsernameValid(username: string): boolean {
    if (!username) return false;
    return /^[a-zA-Z0-9_]+$/.test(username);
  }

  // Get password CSS class
  getPasswordCssClass(): string {
    if (!this.formModel.passwordHash) return '';
    return this.isPasswordStrong(this.formModel.passwordHash)
      ? ''
      : 'password-weak';
  }

  // Get confirm password CSS class
  getConfirmPasswordCssClass(): string {
    if (!this.formModel.confirmPassword) return '';
    return this.doPasswordsMatch() ? '' : 'password-mismatch';
  }

  // Get username CSS class
  getUsernameCssClass(): string {
    if (!this.formModel.userName) return '';
    return this.isUsernameValid(this.formModel.userName)
      ? ''
      : 'username-invalid';
  }

  // Validation helper methods for Step 1 fields
  isNameInvalid(nameField: any): boolean {
    return nameField?.invalid && nameField?.touched;
  }

  getUserNameInvalid(userNameField: any): boolean {
    const hasAngularErrors = userNameField?.invalid && userNameField?.touched;
    const hasCustomErrors =
      this.formModel.userName && !this.isUsernameValid(this.formModel.userName);
    return hasAngularErrors || hasCustomErrors;
  }

  isPasswordInvalid(passwordField: any): boolean {
    const hasAngularErrors = passwordField?.invalid && passwordField?.touched;
    const hasCustomErrors =
      this.formModel.passwordHash &&
      !this.isPasswordStrong(this.formModel.passwordHash);
    return hasAngularErrors || hasCustomErrors;
  }

  isConfirmPasswordInvalid(confirmPasswordField: any): boolean {
    const hasAngularErrors =
      confirmPasswordField?.invalid && confirmPasswordField?.touched;
    const hasCustomErrors =
      this.formModel.confirmPassword && !this.doPasswordsMatch();
    return hasAngularErrors || hasCustomErrors;
  }

  isEmailInvalid(emailField: any): boolean {
    return emailField?.invalid && emailField?.touched;
  }

  isPhoneInvalid(phoneField: any): boolean {
    return phoneField?.invalid && phoneField?.touched;
  }

  isGenderInvalid(genderField: any): boolean {
    return genderField?.invalid && genderField?.touched;
  }

  isDateOfBirthInvalid(dateField: any): boolean {
    return dateField?.invalid && dateField?.touched;
  }

  isCountryInvalid(countryField: any): boolean {
    return countryField?.invalid && countryField?.touched;
  }

  // Error message methods for Step 1 fields
  getNameErrorMessage(nameField: any): string {
    if (nameField?.errors?.['required']) {
      return 'Full name is required';
    }
    return '';
  }

  getUserNameErrorMessage(userNameField: any): string {
    if (userNameField?.errors?.['required']) {
      return 'Username is required';
    }
    if (
      this.formModel.userName &&
      !this.isUsernameValid(this.formModel.userName)
    ) {
      return 'Username can only contain letters (a-z, A-Z), numbers (0-9), and underscores (_)';
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
    if (
      this.formModel.passwordHash &&
      !this.isPasswordStrong(this.formModel.passwordHash)
    ) {
      return 'Password must contain at least 6 characters with lowercase, uppercase, numbers, and symbols';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(confirmPasswordField: any): string {
    if (confirmPasswordField?.errors?.['required']) {
      return 'Please confirm your password';
    }
    if (confirmPasswordField?.errors?.['minlength']) {
      return 'Password must be at least 6 characters long';
    }
    if (
      this.formModel.passwordHash &&
      this.formModel.confirmPassword &&
      !this.doPasswordsMatch()
    ) {
      return 'Passwords do not match';
    }
    return '';
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

  getPhoneErrorMessage(phoneField: any): string {
    if (phoneField?.errors?.['required']) {
      return 'Mobile number is required';
    }
    return '';
  }

  getGenderErrorMessage(genderField: any): string {
    if (genderField?.errors?.['required']) {
      return 'Gender is required';
    }
    return '';
  }

  getDateOfBirthErrorMessage(dateField: any): string {
    if (dateField?.errors?.['required']) {
      return 'Date of birth is required';
    }
    return '';
  }

  getCountryErrorMessage(countryField: any): string {
    if (countryField?.errors?.['required']) {
      return 'Country is required';
    }
    return '';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading.set(true);

    const signUpData = {
      userName: this.formModel.userName,
      email: this.formModel.email,
      passwordHash: this.formModel.passwordHash,
      confirmPassword: this.formModel.confirmPassword,
      phoneNumber: this.formModel.phoneNumber,
      patient: {
        name: this.formModel.name,
        gender: this.formModel.gender,
        dateOfBirth: this.formModel.dateOfBirth,
        country: this.formModel.country,
        address: this.formModel.address,
        patientDiseases: this.formModel.patientDiseases,
        patientDrugs: this.formModel.patientDrugs,
      },
    };

    this.authService.signUp(signUpData).subscribe({
      next: (resData) => {
        console.log(resData);
        this.isLoading.set(false);
        form.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(signUpData.passwordHash);
        console.log(signUpData.confirmPassword);

        console.log('Signup error details:');
        console.log('Full error object:', error);
        console.log('Error status:', error.status);
        console.log('Error body:', error.error);

        // Show the specific validation errors
        if (error.error && error.error.errors) {
          console.log('Validation errors:', error.error.errors);

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
