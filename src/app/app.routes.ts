import { Routes } from '@angular/router';
import { ClientLayout } from './features/client-dashboard/client-layout/client-layout';
import { Auth } from './features/auth/auth.component';

export const routes: Routes = [
  { path: '', redirectTo: '/client', pathMatch: 'full' },

  {
    path: 'auth',
    component: Auth,
    // loadComponent: () =>
    //   import('./features/auth/auth.component').then((m) => m.Auth),
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin-dashboard/admin-dashboard.module').then(
        (m) => m.AdminDashboardModule
      ),
  },
  {
    path: 'pharmacy',
    loadChildren: () =>
      import('./features/pharmacy-dashboard/pharmacy-dashboard.module').then(
        (m) => m.PharmacyDashboardModule
      ),
  },
  {
    path: 'client',
    loadComponent: () =>
      import('./features/client-dashboard/client-layout/client-layout').then(
        (m) => m.ClientLayout
      ),
    loadChildren: () =>
      import(
        './features/client-dashboard/client-dashboard-routing.module'
      ).then((m) => m.ClientDashboardRoutingModule),
  },
  { path: '**', redirectTo: '/user' },
];
