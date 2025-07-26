import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class Auth {
  isLoginMode = true;

  authService = inject(AuthService);

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log('Logged');
    console.log(form.value);
    if (this.isLoginMode) {
      const email = form.value.email;
      const password = form.value.password;
      this.authService.login(email, password).subscribe({
        next: (resData) => console.log(resData),
        error: (error) => console.log(error),
      });
    } else {
      console.log('Signed Up');
      console.log(form.value);
      const email = form.value.email;
      const userName = form.value.userName;
      const password = form.value.password;
      this.authService.signUp(email, userName, password).subscribe({
        next: (resData) => console.log(resData),
        error: (error) => console.log(error),
      });
    }
    form.reset();
  }
}
