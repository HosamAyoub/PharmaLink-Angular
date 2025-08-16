import {
  Component,
  inject,
  signal,
  computed,

} from '@angular/core';
import { SideBar } from  '../../../shared/components/side-bar/side-bar';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { DrugService } from '../../Services/drug-service';
import { IDrug } from '../../Models/IDrug';
import { ActivatedRoute } from '@angular/router';
import { DrugImageComponent } from '../../../../../shared/components/drug-image/drug-image';


@Component({
  selector: 'client-products-screen',
  templateUrl: './products-screen.html',
  styleUrls: ['./products-screen.css'],
  imports: [SideBar, CommonModule, RouterLink, NgClass, DrugImageComponent],
})
export class ProductsScreen {
  drugservice: DrugService = inject(DrugService);
  FavDrug: FavoriteService = inject(FavoriteService);
  categoryName: string = '';

  Drugs = signal<IDrug[]>([]);

  // Create a computed property that reactively tracks favorite changes
  favoriteDrugs = computed(() => this.FavDrug.favoriteDrugs());

  /**
   *
   */
  constructor() {
    const route = inject(ActivatedRoute);
    route.paramMap.subscribe(params => {
      this.categoryName = params.get('categoryName') || '';
      this.onCategoryNameSelected(this.categoryName);
    });

  }

  ReceiveCategoryDrugs(categoryDrugs: IDrug[]) {
    this.Drugs.set(categoryDrugs);
  }

  onCategoryNameSelected(category: string) {
    if (category === '') {
      this.drugservice.getRandomDrugs().subscribe({
        next: (data) => {
          this.Drugs.set(data);
        },
      });
    } else {
      this.drugservice.getDrugsByCategory(category).subscribe({
        next: (data) => {
          this.Drugs.set(data);
        },
      });
    }
  }

  SendDrugSelected(drug: IDrug) {
  }

  ngAfterViewInit()
  {
}

Category_ToggleFavorites(drug: IDrug)
{
  this.FavDrug.ToggleFavorites(drug);
}

  Category_isFavorite(drugId: number): boolean
  {
    // Use the computed property to make this reactive
    const favorites = this.favoriteDrugs();
    if (!Array.isArray(favorites)) return false;
    return favorites.some(d => d.drugId === drugId);
  }

}
