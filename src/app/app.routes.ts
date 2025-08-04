import { Routes } from '@angular/router';
import { LoadingSpinner } from './shared/components/loading-spinner/loading-spinner';
import { Login } from './features/auth/login/login';
import { SignUp } from './features/auth/signup/signup';

export const routes: Routes = [
  { path: '', redirectTo: '/client', pathMatch: 'full' },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: SignUp,
  },
  { path: 'loading', component: LoadingSpinner },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin-dashboard/admin-dashboard.module').then(
        (m) => m.AdminDashboardModule
      ),
  },
  {
    path: 'pharmacy',
    loadComponent: () =>
      import('./features/pharmacy-dashboard/pharmacy-layout/pharmacy-layout').then(
        (m) => m.PharmacyLayout
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/pharmacy-dashboard/pharmacy-dashboard-routing.module').then(
            (m) => m.PharmacyDashboardRoutingModule
          )
      },
    ],
  },
  {
    path: 'client',
    loadComponent: () =>
      import('./features/client-dashboard/client-layout/client-layout').then(
        (m) => m.ClientLayout
      ),
    children: [
      // Add the nearby-pharmacies route as a child of client
      {
        path: 'nearby-pharmacies',
        loadComponent: () =>
          import(
            './features/client-dashboard/Pharmacies/nearby-pharmacies-page/nearby-pharmacies-page'
          ).then((m) => m.NearbyPharmaciesPage),
      },
      // You can add more client child routes here
      {
        path: '',
        loadChildren: () =>
          import('./features/client-dashboard/client-dashboard-routing.module').then((m) => m.ClientDashboardRoutingModule),
      },
    ],
  },
  { path: '**', redirectTo: '/client' },
];
