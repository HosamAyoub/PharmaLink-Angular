import { AnalyticsPage } from './Analytics/analytics-page/analytics-page';
import { DashboardPage } from './Dashboard/dashboard-page/dashboard-page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PharmacyLayout } from './pharmacy-layout/pharmacy-layout';
import { OrdersPage } from './orders/orders-page/orders-page';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'ordersManagement', loadComponent: () =>
      import('./orders/orders-page/orders-page').then((m) => m.OrdersPage),
  },
  {
    path: 'medicinemanagement',
    loadComponent: () =>
      import('./inventory/medicine-management/medicine-management').then((m) => m.MedicineManagement),
  },
  {
    path: 'addmedicines',
    loadComponent: () =>
      import('./inventory/add-medicines-component/add-medicines-component').then((m) => m.AddMedicinesComponent),
  },
  {
    path: "analytics",
    loadComponent: () =>
      import('./Analytics/analytics-page/analytics-page').then((m) => m.AnalyticsPage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/pharmacy-profile-page/pharmacy-profile-page').then((m) => m.PharmacyProfilePage),
  },
  { path: 'dashboard', component: DashboardPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyDashboardRoutingModule { }
