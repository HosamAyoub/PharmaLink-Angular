import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Get the current user from the signal
  const user = authService.user();

  // If user exists and has a valid token, attach it to the request
  if (user && user.token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${user.token}`),
    });

    return next(authReq);
  }

  // If no user or token, proceed with the original request
  return next(req);
};
