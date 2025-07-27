import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_BASE_URL } from '../api.constants';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { ResponseData, User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  http = inject(HttpClient);
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
            new Date(resData.value.expiration),
            resData.value.userName
          );
          this.user.set(user);
        })
      );
  }

  logout() {
    this.user.set(null);
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
