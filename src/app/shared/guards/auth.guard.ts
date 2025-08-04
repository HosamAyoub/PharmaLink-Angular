import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const isAuth = this.authService.user();

    // Not authenticated, redirect to login
    if (!isAuth) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }
    const allowedRoles = route.data['roles'] as string[];

    // Not authorized user
    if (allowedRoles && isAuth.role != allowedRoles[0]) {
      return this.router.createUrlTree(['/not-authorized']);
    }
    // Authenticated and authorized user
    return true;
  }
}
