import { Injectable, signal, inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { IsignupPharmacy, ResponseData, SignUpData, User } from '../models/user.model';
import { ConfigService } from './config.service';
import { APP_CONSTANTS } from '../constants/app.constants';
import { CartStore } from '../../features/client-dashboard/Cart/Services/cart-store';
import { FavoriteService } from '../../features/client-dashboard/Favorites/Services/favorite-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  cartStore = inject(CartStore);
  favService = inject(FavoriteService);
  private tokenExpirationDuration: any;
  config = inject(ConfigService);
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  signUp(signUpData: SignUpData) {
    // Adapt payload to backend expectations (with nested patient object)
    const payload = {
      userName: signUpData.userName,
      email: signUpData.email,
      passwordHash: signUpData.passwordHash,
      confirmPassword: signUpData.confirmPassword,
      phoneNumber: signUpData.phoneNumber,
      patient: {
        name: signUpData.patient.name,
        gender: Number(signUpData.patient.gender), // 0=Male, 1=Female
        dateOfBirth: signUpData.patient.dateOfBirth,
        country: signUpData.patient.country,
        address: signUpData.patient.address,
        medicalHistory: signUpData.patient.medicalHistory,
        medications: signUpData.patient.medications,
        allergies: signUpData.patient.allergies,
      },
    };
    const url = this.config.getApiUrl(this.ENDPOINTS.ACCOUNT_REGISTER);
    return this.http.post(url, payload).pipe(
      catchError(this.handleError));
  }
  signUpPharmacy(formData: FormData) {
  // Remove Content-Type header - let browser set it automatically with boundary
  const headers = new HttpHeaders();
  //headers.delete('Content-Type');
  const url = this.config.getApiUrl(this.ENDPOINTS.PHARMACY_REGISTER);
  return this.http.post(url, formData, {
    headers: headers,
    reportProgress: true,
    observe: 'response'
  }).pipe(
    catchError(error => {
      console.error('API Error:', error);
      return throwError(() => error);
    })
  );
}
signUpPharmacyJson(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  const url = this.config.getApiUrl(this.ENDPOINTS.ACCOUNT_REGISTER);
  return this.http.post(url, data, {
    headers: headers
  });
}

  login(email: string, password: string, rememberMe: boolean) {
    const url = this.config.getApiUrl(this.ENDPOINTS.ACCOUNT_LOGIN);
    return this.http
      .post<ResponseData>(url, {
        email: email,
        password: password,
        rememberMe: rememberMe,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          const user = new User(
            resData.value.token,
            resData.value.expiration,
            resData.value.userName,
            resData.value.role
          );
          this.user.set(user);
          localStorage.setItem('userData', JSON.stringify(user));
          const expirationDate = new Date(resData.value.expiration);
          const now = new Date();
          const expirationDuration = expirationDate.getTime() - now.getTime();
          this.autoLogout(expirationDuration);

          // Synchronize cart after successful login
          this.cartStore.syncCartAfterLogin();
          this.favService.syncFavoritesAfterLogin().subscribe({
            next: () => console.log('Favorites sync completed'),
            error: (err) => console.error('Favorites sync failed:', err)
          });
        })
      );
  }

  autoLogin() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      return;
    }
    // Use validateToken to verify token and update user state
    this.validateToken()?.subscribe({
      next: () => {
        // User state is updated in validateToken's tap operator
        // const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        // if (returnUrl) {
        //   this.router.navigate([returnUrl]);
        // }
      },
      error: (e) => {
        // If token is invalid, log out the user
        this.logout();
      },
    });
  }

  validateToken() {
    // Get token from local storage
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      return;
    } else {
      const userData = JSON.parse(userDataString);

      // Prepare request to backend VerifyToken endpoint
      const url = this.config.getApiUrl(this.ENDPOINTS.ACCOUNT_VERIFY_TOKEN);

      // Add headers to specify content type
      const headers = {
        'Content-Type': 'application/json', // or 'application/json' if sending as object
      };


      return this.http
        .post<ResponseData>(url, JSON.stringify(userData._token), { headers })
        .pipe(
          catchError(this.handleError),
          tap((resData) => {
            // If valid, update user state with latest data from backend
            const user = new User(
              resData.value.token,
              resData.value.expiration,
              resData.value.userName,
              resData.value.role
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

    // Log specific validation errors
    if (errorResponse.error && errorResponse.error.errors) {
      Object.keys(errorResponse.error.errors).forEach((field) => {
        console.error(`Validation error on ${field}: ${errorResponse.error.errors[field]}`);
      });
    }

    // Return the full error response so we can see what's happening
    return throwError(() => errorResponse);
  }
}
