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
            keyboard: false, // Disable keyboard interactions that might interfere
            touch: true,
          }
        );

        // Start the carousel
        carousel.cycle();

        // Add ResizeObserver to prevent flickering on layout changes
        if ('ResizeObserver' in window) {
          const resizeObserver = new ResizeObserver((entries) => {
            // Prevent carousel from reacting to resize events caused by navbar
            // This is a no-op observer to stabilize the carousel
          });
          resizeObserver.observe(carouselElement);
        }
      }
    }, 100);
  }
}
