import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { ResponseData, User } from '../../core/user.model';

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

  authService = inject(AuthService);
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
      this.authService.signUp(email, userName, password).subscribe({
        next: (resData) => {
          console.log(resData);
          this.isLoading.set(false);
          form.reset();
          this.onSwitchMode();
        },
        error: (error) => {
          console.log(error);
          this.displayedError = 'An error occurred!';
          this.isLoading.set(false);
        },
      });
    }
  }
}
