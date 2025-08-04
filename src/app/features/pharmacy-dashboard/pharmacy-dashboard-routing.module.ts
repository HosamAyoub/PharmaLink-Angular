import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PharmacyLayout } from './pharmacy-layout/pharmacy-layout';
import { Home } from './home/home';
import { OrdersPage } from './orders/orders-page/orders-page';

const routes: Routes = [
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule)
  },
  {
    path: '',
    redirectTo: 'inventory/medicine-management',
    pathMatch: 'full'
  },
  {
    path: 'orders', component: OrdersPage
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'home',
    component: Home,
  },
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyDashboardRoutingModule {}
