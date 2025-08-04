import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
<<<<<<< Updated upstream
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
=======
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
>>>>>>> Stashed changes
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class PharmacyDashboardRoutingModule {}
