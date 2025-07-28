import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'category-section',
  imports: [RouterLink],
  templateUrl: './category-section.html',
  styleUrls: ['./category-section.css', '../../shared/styles/shared-home.css']
})
export class CategorySection {

  // Categories array for the loop
  categories = [
    {
      title: 'Antibiotic',
      description: '150+ medicines',
      image: 'assets/images/icons/drug.svg'
    },
    {
      title: 'Vaccine',
      description: '80+ supplements',
      image: 'assets/images/icons/drug.svg'
    },
    {
      title: 'Antifungals',
      description: '120+ supplies',
      image: 'assets/images/icons/delivery.svg'
    },
    {
      title: 'Muscle relaxants',
      description: '200+ products',
      image: 'assets/images/icons/delivery.svg'
    }
  ];

  viewAllCategories() {
    // TODO: Navigate to all categories page or implement desired functionality
    console.log('View all categories clicked');
  }

}
