import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
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

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading.set(true);

    const signUpData = {
      userName: this.formModel.userName,
      email: this.formModel.email,
      passwordHash: this.formModel.password,
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
        this.router.navigate(['/auth']);
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
