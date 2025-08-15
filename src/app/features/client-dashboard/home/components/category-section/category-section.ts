import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from "../../../shared/components/category/category";
import { CategoriesData } from '../../../../../shared/data/categories-data';

@Component({
  selector: 'category-section',
  imports: [RouterLink, Category],
  templateUrl: './category-section.html',
  styleUrls: ['./category-section.css', '../../shared/styles/shared-home.css'],
})
export class CategorySection {
  // Categories array for the loop
 categories = CategoriesData.slice(0, 4); // Take only the first 4 categories

  viewAllCategories() {
    // TODO: Navigate to all categories page or implement desired functionality
  }
}
