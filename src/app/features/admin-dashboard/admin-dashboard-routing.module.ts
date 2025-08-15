import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrugsManagementComponent } from './Medicines/drugs-management/drugs-management.component';
import { DashboardPageComponent } from '../admin-dashboard/Dashboard/dashboard-page/dashboard-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent },
  {
    path: 'PharmaciesManagement',
    loadComponent: () =>
      import('./Pharmacies/pharmacies-page/pharmacies-page.component').then((m) => m.PharmaciesPageComponent),
  },
  { path : 'medicinesmanagement', component: DrugsManagementComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {

}
