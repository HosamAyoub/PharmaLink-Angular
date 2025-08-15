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
import { UiState } from '../../../../../shared/enums/UIState';
import { LoadingSpinner } from '../../../../../shared/components/loading-spinner/loading-spinner';
import { ErrorHandling } from '../../../../../shared/components/error-handling/error-handling';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'client-products-screen',
  templateUrl: './products-screen.html',
  styleUrls: ['./products-screen.css'],
  imports: [
    SideBar,
    CommonModule,
    RouterLink,
    NgClass,
    DrugImageComponent,
    LoadingSpinner,
    ErrorHandling
  ],
})
export class ProductsScreen {
  drugservice: DrugService = inject(DrugService);
  FavDrug: FavoriteService = inject(FavoriteService);
  categoryName: string = '';

  Drugs = signal<IDrug[]>([]);

  // UI State management
  public UiState = UiState;
  uiState = signal<UiState>(UiState.Loading);
  httpError = signal<HttpErrorResponse | null>(null);

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
    this.uiState.set(UiState.Loading);
    this.httpError.set(null);

    if (category === '') {
      this.drugservice.getRandomDrugs().subscribe({
        next: (data) => {
          this.Drugs.set(data);
          this.uiState.set(UiState.Success);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching random drugs:', error);
          this.httpError.set(error);
          this.uiState.set(UiState.Error);
        }
      });
    } else {
      this.drugservice.getDrugsByCategory(category).subscribe({
        next: (data) => {
          this.Drugs.set(data);
          this.uiState.set(UiState.Success);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching drugs by category:', error);
          this.httpError.set(error);
          this.uiState.set(UiState.Error);
        }
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
