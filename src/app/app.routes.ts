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
    children: [
      // // Add the nearby-pharmacies route as a child of client
      // {
      //   path: 'nearby-pharmacies',
      //   loadComponent: () =>
      //     import(
      //       './features/client-dashboard/Pharmacies/nearby-pharmacies-page/nearby-pharmacies-page'
      //     ).then((m) => m.NearbyPharmaciesPage),
      // },
      // You can add more client child routes here
      {
        path: '',
        loadChildren: () =>
          import(
            './features/client-dashboard/client-dashboard-routing.module'
          ).then((m) => m.ClientDashboardRoutingModule),
      },
    ],
  },
  { path: '**', redirectTo: '/client' },
];
