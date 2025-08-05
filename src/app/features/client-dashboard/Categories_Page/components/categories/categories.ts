import { Component } from '@angular/core';
import { Category } from "../../../shared/components/category/category";
import { CategoriesData } from '../../../../../shared/data/categories-data';

@Component({
  selector: 'app-categories',
  imports: [Category],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {

  categories = CategoriesData;

}
