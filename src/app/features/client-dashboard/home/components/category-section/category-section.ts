import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../shared/components/category/category';
import { CategoriesData } from '../../../../../shared/data/categories-data';

@Component({
  selector: 'category-section',
  imports: [RouterLink, Category],
  templateUrl: './category-section.html',
  styleUrls: ['./category-section.css', '../../shared/styles/shared-home.css'],
})
export class CategorySection implements OnInit, AfterViewInit {
  // Categories array for the loop
  categories = CategoriesData.slice(8, 12); // Take only the first 4 categories

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    // Initialize carousel after view is ready
    setTimeout(() => {
      const carouselElement = document.getElementById('categoriesCarousel');
      if (carouselElement) {
        // Check if Bootstrap is available
        if ((window as any).bootstrap && (window as any).bootstrap.Carousel) {
          const carousel = new (window as any).bootstrap.Carousel(
            carouselElement,
            {
              interval: 3000,
              wrap: true,
              pause: 'hover',
              ride: 'carousel',
            }
          );
          // Start the carousel
          carousel.cycle();
        } else {
          // Fallback: Use data attributes to initialize
          carouselElement.setAttribute('data-bs-ride', 'carousel');
          carouselElement.setAttribute('data-bs-interval', '3000');
          carouselElement.setAttribute('data-bs-wrap', 'true');
          carouselElement.setAttribute('data-bs-pause', 'hover');

          // Try to trigger Bootstrap initialization
          setTimeout(() => {
            if (
              (window as any).bootstrap &&
              (window as any).bootstrap.Carousel
            ) {
              const carousel = new (window as any).bootstrap.Carousel(
                carouselElement
              );
              carousel.cycle();
            }
          }, 500);
        }
      }
    }, 200);
  }

  viewAllCategories() {
    // TODO: Navigate to all categories page or implement desired functionality
  }
}
