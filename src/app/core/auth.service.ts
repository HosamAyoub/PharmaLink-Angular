import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from './api.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);
  signUp(userName: string, email: string, password: string) {
    return this.http.post(API_BASE_URL + 'Account/Register', {
      userName: userName,
      email: email,
      passwordHash: password,
      confirmPassword: password,
      phoneNumber: '123423425',
      patient: {
        name: 'angular',
        gender: 0,
        dateOfBirth: '2020-07-26',
        country: 'Egypt',
        address: 'Fayoum',
        patientDiseases: 'Clear',
        patientDrugs: 'Clear',
      },
    });
  }
  login(email: string, password: string) {
    return this.http.post(API_BASE_URL + 'Account/Login', {
      email: email,
      password: password,
      rememberMe: true,
    });
  }
}
