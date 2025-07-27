import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_BASE_URL } from '../api.constants';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { ResponseData, User } from './user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  http = inject(HttpClient);
  router = inject(Router);
  private tokenExpirationDuration: any;

  signUp(
    userName: string,
    email: string,
    password: string,
    phoneNumber: string
  ) {
    const payload = {
      userName: userName,
      email: email,
      passwordHash: password,
      confirmPassword: password,
      phoneNumber: phoneNumber || '1234567890',
    };

    console.log('🚀 Sending signup payload:', payload);
    console.log('📍 To URL:', API_BASE_URL + 'Account/Register');

    return this.http
      .post(API_BASE_URL + 'Account/Register', payload)
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<ResponseData>(API_BASE_URL + 'Account/Login', {
        email: email,
        password: password,
        rememberMe: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          const user = new User(
            resData.value.token,
            resData.value.expiration,
            resData.value.userName
          );
          this.user.set(user);
          localStorage.setItem('userData', JSON.stringify(user));
          const expirationDate = new Date(resData.value.expiration);
          const now = new Date();
          const expirationDuration = expirationDate.getTime() - now.getTime();
          this.autoLogout(expirationDuration);
        })
      );
  }

  autoLogin() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      return;
    } else {
      const userData = JSON.parse(userDataString);
      const loadedUser = new User(
        userData._token,
        userData._expiration,
        userData.userName
      );
      if (loadedUser.token) {
        this.user.set(loadedUser);
        const expirationDate = new Date(userData._expiration);
        const now = new Date();
        const expirationDuration = expirationDate.getTime() - now.getTime();
        this.autoLogout(expirationDuration);
      }
    }
  }

  logout() {
    this.user.set(null);
    this.router.navigate(['/client/home']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationDuration) {
      clearTimeout(this.tokenExpirationDuration);
    }
    this.tokenExpirationDuration = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationDuration = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.log('🔥 HTTP Error Details:', errorResponse);
    console.log('Status:', errorResponse.status);
    console.log('Error body:', errorResponse.error);

    // Log specific validation errors
    if (errorResponse.error && errorResponse.error.errors) {
      console.log('🚨 Detailed validation errors:');
      Object.keys(errorResponse.error.errors).forEach((field) => {
        console.log(`❌ ${field}:`, errorResponse.error.errors[field]);
      });
    }

    // Return the full error response so we can see what's happening
    return throwError(() => errorResponse);
  }
}
