import {
  Component,
  inject,
  signal,

} from '@angular/core';
import { SideBar } from  '../../../shared/components/side-bar/side-bar';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { DrugService } from '../../Services/drug-service';
import { IDrug } from '../../Models/IDrug';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'client-products-screen',
  templateUrl: './products-screen.html',
  styleUrls: ['./products-screen.css'],
  imports: [SideBar, CommonModule, RouterLink, NgClass],
})
export class ProductsScreen {
  drugservice: DrugService = inject(DrugService);
  FavDrug: FavoriteService = inject(FavoriteService);
  categoryName: string = '';

  Drugs = signal<IDrug[]>([]);
  imageErrors = new Set<number>(); // Track which images failed to load

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
    console.log('Drugs Received:', this.Drugs);
  }

  onCategoryNameSelected(category: string) {
    if (category === '') {
      this.drugservice.getRandomDrugs().subscribe({
        next: (data) => {
          this.Drugs.set(data);
          console.log('Random Drugs:', data);
        },
      });
    } else {
      this.drugservice.getDrugsByCategory(category).subscribe({
        next: (data) => {
          this.Drugs.set(data);
          console.log('Drugs in category:', data);
        },
      });
    }
  }

  SendDrugSelected(drug: IDrug) {
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

   // Handle successful image loading
  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.classList.remove('error');
  }

  // Check if image has error
  hasImageError(index: number): boolean {
    return this.imageErrors.has(index);
  }

    onImageError(event: Event, productIndex?: number) {
    const imgElement = event.target as HTMLImageElement;

    // Set fallback image
    //imgElement.src = 'assets/images/error-placeholder.jpg';
    imgElement.classList.add('error');

    // Track error for this product
    if (productIndex !== undefined) {
      this.imageErrors.add(productIndex);
    }

  }



}
