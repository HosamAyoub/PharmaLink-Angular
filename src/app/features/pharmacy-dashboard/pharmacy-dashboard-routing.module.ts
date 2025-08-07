import { DashboardPage } from './Dashboard/dashboard-page/dashboard-page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  { path: 'dashboard', component: DashboardPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyDashboardRoutingModule { }
