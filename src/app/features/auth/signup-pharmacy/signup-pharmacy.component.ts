import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { RequestsSignalRService } from '../../pharmacy-dashboard/Shared/Services/requests-signal-r.service';

@Component({
  selector: 'app-signup-pharmacy',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinner],
  templateUrl: './signup-pharmacy.component.html',
  styleUrl: './signup-pharmacy.component.css'
})
export class SignupPharmacyComponent {
  requestsignalrservice: RequestsSignalRService = inject(RequestsSignalRService);
  isLoading = signal(false);
  displayedError = '';
  acceptedTerms = false;


  ngOnInit() {
    this.requestsignalrservice.startConnection();
  }

  // Model for pharmacy registration
  formModel: any = {
    userName: '',
    email: '',
    passwordHash: '',
    confirmPassword: '',
    phoneNumber: '',
    pharmacy: {
      name: '',
      ownerName: '',
      country: '',
      address: '',
      doc: null,
      startHour: '',
      endHour: ''
    }
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

  // Validation helper methods
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

  isPharmacyNameInvalid(nameField: any): boolean {
    return nameField?.invalid && nameField?.touched;
  }

  isOwnerNameInvalid(ownerField: any): boolean {
    return ownerField?.invalid && ownerField?.touched;
  }

  isPharmacyCountryInvalid(countryField: any): boolean {
    return countryField?.invalid && countryField?.touched;
  }

  isAddressInvalid(addressField: any): boolean {
    return addressField?.invalid && addressField?.touched;
  }

  // Error message methods
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
    if (phoneField?.errors?.['pattern']) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  getPharmacyNameErrorMessage(nameField: any): string {
    if (nameField?.errors?.['required']) {
      return 'Pharmacy name is required';
    }
    return '';
  }

  getOwnerNameErrorMessage(ownerField: any): string {
    if (ownerField?.errors?.['required']) {
      return 'Owner name is required';
    }
    return '';
  }

  getPharmacyCountryErrorMessage(countryField: any): string {
    if (countryField?.errors?.['required']) {
      return 'Country is required';
    }
    return '';
  }

  getAddressErrorMessage(addressField: any): string {
    if (addressField?.errors?.['required']) {
      return 'Address is required';
    }
    return '';
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formModel.pharmacy.doc = file;
    } else {
      this.formModel.pharmacy.doc = null;
    }
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      console.error('Form is invalid');
      return;
    }

    this.isLoading.set(true);

    try {
      let result;

      if (this.formModel.pharmacy.doc) {
        // With file - use FormData
        const formData = new FormData();

        // Append all fields
        formData.append('userName', this.formModel.userName);
        formData.append('email', this.formModel.email);
        formData.append('passwordHash', this.formModel.passwordHash);
        formData.append('confirmPassword', this.formModel.confirmPassword);
        formData.append('phoneNumber', this.formModel.phoneNumber);

        // Pharmacy fields
        formData.append('pharmacy.name', this.formModel.pharmacy.name);
        formData.append('pharmacy.ownerName', this.formModel.pharmacy.ownerName);
        formData.append('pharmacy.country', this.formModel.pharmacy.country);
        formData.append('pharmacy.address', this.formModel.pharmacy.address);

        if (this.formModel.pharmacy.doc) {
          formData.append('pharmacy.doc', this.formModel.pharmacy.doc);
        }

        if (this.formModel.pharmacy.startHour) {
          formData.append('pharmacy.startHour', this.formModel.pharmacy.startHour);
        }
        if (this.formModel.pharmacy.endHour) {
          formData.append('pharmacy.endHour', this.formModel.pharmacy.endHour);
        }

        result = await this.authService.signUpPharmacy(formData).subscribe({
          next: (response) => {
            console.log('Pharmacy registration successful:', response);
          },
          error: (error) => {
            console.error('Pharmacy registration failed:', error);
          }
        });
      } else {
        // Without file - use JSON
        const signUpData = {
          userName: this.formModel.userName,
          email: this.formModel.email,
          passwordHash: this.formModel.passwordHash,
          confirmPassword: this.formModel.confirmPassword,
          phoneNumber: this.formModel.phoneNumber,
          pharmacy: {
            name: this.formModel.pharmacy.name,
            ownerName: this.formModel.pharmacy.ownerName,
            country: this.formModel.pharmacy.country,
            address: this.formModel.pharmacy.address,
            startHour: this.formModel.pharmacy.startHour,
            endHour: this.formModel.pharmacy.endHour
          }
        };

        result = await this.authService.signUpPharmacyJson(signUpData).toPromise();
      }
      this.requestsignalrservice.sendRegistrationRequest(`${this.formModel.pharmacy.name} has sent your registration request !`).subscribe({
              next: () => {
                console.log('Registration request sent successfully');
              },
              error: (err) => {
                console.error('Error sending registration request:', err);
              }
            });
      console.log('Registration successful:', result);
      form.reset();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Registration failed:', error);
      //this.displayedError = error.error?.title || 'Registration failed';
    } finally {
      this.isLoading.set(false);
    }
  }

}