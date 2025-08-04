import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicineManagement } from './medicine-management/medicine-management';

const routes: Routes = [
  { path: 'medicine-management', component: MedicineManagement }
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class InventoryModule {}
