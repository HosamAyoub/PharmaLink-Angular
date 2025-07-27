import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreen } from './home/home-screen/home-screen';
import { CategoryList } from './Categories_Page/category-list/category-list';
import { DrugDetails } from './Details/drug-details/drug-details';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeScreen

  },
  {
    path: 'category',
    component: CategoryList
  },
  {
    path: 'DrugDetails/:id',
    component: DrugDetails
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDashboardRoutingModule {}
