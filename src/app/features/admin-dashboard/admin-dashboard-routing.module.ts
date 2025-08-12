import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrugsManagementComponent } from './Medicines/drugs-management/drugs-management.component';
import { OrdersPageComponent } from './Orders/orders-page/orders-page.component';

const routes: Routes = [
  { path: 'medicinesmanagement', component: DrugsManagementComponent },
  { path: 'orders', component: OrdersPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule { }
