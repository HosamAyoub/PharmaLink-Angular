import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrugsManagementComponent } from './Medicines/drugs-management/drugs-management.component';

const routes: Routes = [
  { path : 'medicinesmanagement', component: DrugsManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
