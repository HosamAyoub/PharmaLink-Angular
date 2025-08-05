import {
  Component,
  inject,
  signal,

} from '@angular/core';
import { SideBar } from  '../../../shared/components/side-bar/side-bar';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../../Favorites/Services/favorite-service';
import { IDrug } from '../../models/IDrug';
import { DrugService } from '../../service/drug-service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
  imports: [SideBar, CommonModule, RouterLink, NgClass],
})
export class CategoryList {
  drugservice: DrugService = inject(DrugService);
  FavDrug: FavoriteService = inject(FavoriteService);
  Drugs = signal<IDrug[]>([]);
  imageErrors = new Set<number>(); // Track which images failed to load

  ReceiveCategoryDrugs(categoryDrugs: IDrug[]) {
    this.Drugs.set(categoryDrugs);
    console.log('Drugs Received:', this.Drugs);
  }

  onCategoryNameSelected(category: string) {
    // Clear image errors when switching categories
    this.imageErrors.clear();

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
