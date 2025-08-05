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
    path: 'addproduct/:id',
    loadComponent: () =>
      import('./inventory/add-medicine-details-component/add-medicine-details-component').then((m) => m.AddMedicineDetailsComponent),
  },
  
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  { path: 'dashboard', component:DashboardPage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyDashboardRoutingModule { }
