import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreen } from './home/home-screen/home-screen';
import { DrugDetails } from './Details/component/drug-details/drug-details';
import { CartPage } from './Cart/Components/cart-page/cart-page';
import { SuccessPage } from './Cart/Components/success-page/success-page';
import { CancelPage } from './Cart/Components/cancel-page/cancel-page';
import { FavoritePage } from './Favorites/Components/favorite-page/favorite-page';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { NearbyPharmaciesPage } from './Pharmacies/nearby-pharmacies-page/nearby-pharmacies-page';
import { PharmacyStock } from './Pharmacy-Products/components/pharmacy-stock-page/pharmacy-stock';
import { PharamcyProductDetails } from './pharamcy-product-details/pharamcy-product-details';
import { ProductsScreen } from './Products/Components/products-screen/products-screen';
import { Categories } from './Categories_Page/components/categories/categories';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeScreen,
  },
  {
    path: 'products',
    component: ProductsScreen,
  },
  {
    path: 'categories',
    component: Categories,

  },
  {
    path: 'products/:categoryName',
    component: ProductsScreen,
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
