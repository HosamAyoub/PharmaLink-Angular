import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreen } from './home/home-screen/home-screen';
import { CartPage } from './Cart/Components/cart-page/cart-page';
import { SuccessPage } from './Cart/Components/success-page/success-page';
import { CancelPage } from './Cart/Components/cancel-page/cancel-page';
import { FavoritePage } from './Favorites/Components/favorite-page/favorite-page';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeScreen

  },

  { path: 'cart', component: CartPage },
  { path: 'success', component: SuccessPage },
  { path: 'cancel', component: CancelPage },
{path: 'favorites', component: FavoritePage}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDashboardRoutingModule { }
