import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  inject,
  output,
  Output,
  viewChild,
} from '@angular/core';
import { SideBar } from  '../../shared/components/side-bar/side-bar';
import { IDrug } from '../../../../core/drug/IDrug';
import { DrugService } from '../../../../core/drug/drug-service';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../Favorites/Services/favorite-service';
import { IFavDrug } from '../../../../core/drug/IFavDrug';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
  imports: [SideBar, CommonModule, RouterLink, NgClass],
})
export class CategoryList {
  DrugData: DrugService = inject(DrugService);
  FavDrug: FavoriteService = inject(FavoriteService);
  Drugs: IFavDrug[] = [];



 ReceiveCategoryDrugs(categoryDrugs: IFavDrug[]) {
    this.Drugs = categoryDrugs;
    console.log('Drugs Received:', this.Drugs);
  }

  SendDrugSelected(drug: IFavDrug) {
    console.log('Selected Drug:', drug);
  }

  ngAfterViewInit()
  {
  console.log('Drugs in AfterViewInit:', this.Drugs);
}

Category_ToggleFavorites(drugId: number)
{
  this.FavDrug.ToggleFavorites(drugId);
}

  Category_isFavorite(drugId: number): boolean
  {
    return this.FavDrug.isFavorite(drugId);
  }


}
