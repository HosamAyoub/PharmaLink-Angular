import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreen } from './home/home-screen/home-screen';
import { CategoryList } from './Categories_Page/component/category-list/category-list';
import { DrugDetails } from './Details/component/drug-details/drug-details';
import { CartPage } from './Cart/Components/cart-page/cart-page';
import { SuccessPage } from './Cart/Components/success-page/success-page';
import { CancelPage } from './Cart/Components/cancel-page/cancel-page';
import { FavoritePage } from './Favorites/Components/favorite-page/favorite-page';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { NearbyPharmacies } from './Details/component/nearby-pharmacies/nearby-pharmacies';
import { NearbyPharmaciesPage } from './Pharmacies/nearby-pharmacies-page/nearby-pharmacies-page';
import { PharmacyStock } from './Pharmacy-Products/components/pharmacy-stock-page/pharmacy-stock';
import { PharamcyProductDetails } from './pharamcy-product-details/pharamcy-product-details';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeScreen,
  },
  {
    path: 'category',
    component: CategoryList,
  },
  {
    path: 'category/:categoryName',
    component: CategoryList,
  },
  {
    path: 'DrugDetails/:id',
    component: DrugDetails,
  },
  {
    path: 'pharmacies',
    component: NearbyPharmaciesPage,
  },
  {
    path: 'pharmacyStock/:id',
    component: PharmacyStock,
  },
  {
    path:'pharmacyProduct/:id',
    component: PharamcyProductDetails
  },
  { path: 'cart', component: CartPage, canActivate: [AuthGuard] },
  { path: 'success', component: SuccessPage },
  { path: 'cancel', component: CancelPage },
  { path: 'favorites', component: FavoritePage, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDashboardRoutingModule {}
