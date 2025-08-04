import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PharmacyLayout } from './pharmacy-layout/pharmacy-layout';
import { Home } from './home/home';

const routes: Routes = [
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
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyDashboardRoutingModule { }
