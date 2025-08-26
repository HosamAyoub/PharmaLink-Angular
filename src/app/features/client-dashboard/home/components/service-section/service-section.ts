import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'service-section',
  imports: [],
  templateUrl: './service-section.html',
  styleUrl: './service-section.css',
})
export class ServiceSection implements OnInit, AfterViewInit {
  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    // Initialize carousel after view is ready
    setTimeout(() => {
      const carouselElement = document.getElementById('servicesCarousel');
      if (carouselElement && (window as any).bootstrap) {
        const carousel = new (window as any).bootstrap.Carousel(
          carouselElement,
          {
            interval: 3000,
            wrap: true,
            pause: 'hover',
          }
        );
        // Start the carousel
        carousel.cycle();
      }
    }, 100);
  }
}
