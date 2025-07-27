import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_BASE_URL } from '../api.constants';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { ResponseData, User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  http = inject(HttpClient);
  signUp(userName: string, email: string, password: string) {
    // return this.http.post(API_BASE_URL + 'Account/Register', {
    //   userName: userName,
    //   email: email,
    //   passwordHash: password,
    //   confirmPassword: password,
    //   phoneNumber: '123423425',
    //   patient: {
    //     name: 'angular',
    //     gender: 0,
    //     dateOfBirth: '2020-07-26',
    //     country: 'Egypt',
    //     address: 'Fayoum',
    //     patientDiseases: 'Clear',
    //     patientDrugs: 'Clear',
    //   },
    // });
    return this.http
      .post(API_BASE_URL + 'Account/Register', {
        userName: userName,
        email: email,
        passwordHash: password,
        confirmPassword: password,
        phoneNumber: '45678',
      })
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
    let errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      // add logic of error messages here
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
    }
    return throwError(errorMessage);
  }
}
