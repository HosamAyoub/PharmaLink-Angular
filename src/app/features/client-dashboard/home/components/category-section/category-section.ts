import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'category-section',
  imports: [RouterLink],
  templateUrl: './category-section.html',
  styleUrls: ['./category-section.css', '../../shared/styles/shared-home.css'],
})
export class CategorySection {
  // Categories array for the loop
  categories = [
    {
      title: 'Antibiotic',
      description: '150+ medicines',
      image: '/assets/images/icons/antibiotic.png',
    },
    {
      title: 'Vaccine',
      description: '80+ supplements',
      image: 'assets/images/icons/syringe-svgrepo-com.svg',
    },
    {
      title: 'Cough suppressants',
      description: '120+ supplies',
      image: '/assets/images/icons/lungs-svgrepo-com.svg',
    },
    {
      title: 'Muscle relaxants',
      description: '200+ products',
      image: 'assets/images/icons/muscle.png',
    },
  ];

  viewAllCategories() {
    // TODO: Navigate to all categories page or implement desired functionality
    console.log('View all categories clicked');
  }
}
