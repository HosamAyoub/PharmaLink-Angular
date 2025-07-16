import { Component } from '@angular/core';

@Component({
  selector: 'category-section',
  imports: [],
  templateUrl: './category-section.html',
  styleUrls: ['./category-section.css', '../../shared/styles/shared-home.css']
})
export class CategorySection {

  // Categories array for the loop
  categories = [
    {
      title: 'Pain Relief',
      description: '150+ medicines',
      image: 'assets/images/icons/drug.svg'
    },
    {
      title: 'Vitamins',
      description: '80+ supplements',
      image: 'assets/images/icons/drug.svg'
    },
    {
      title: 'First Aid',
      description: '120+ supplies',
      image: 'assets/images/icons/delivery.svg'
    },
    {
      title: 'Health Care',
      description: '200+ products',
      image: 'assets/images/icons/delivery.svg'
    }
  ];

  viewAllCategories() {
    // TODO: Navigate to all categories page or implement desired functionality
    console.log('View all categories clicked');
  }

}
