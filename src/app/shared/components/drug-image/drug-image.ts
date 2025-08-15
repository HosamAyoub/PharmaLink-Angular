import { Component, Input, OnChanges, SimpleChanges, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drug-image',
  templateUrl: './drug-image.html',
  styleUrls: ['./drug-image.css'],
  imports: [CommonModule],
})
export class DrugImageComponent implements OnChanges, OnDestroy {
  @Input() src: string = '';
  @Input() alt: string = 'Drug Image';
  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() fallbackSrc: string = 'assets/images/error-image.jpg';
  @Input() borderRadius: string = '0px';
  @Input() classes: string = 'img-fluid product-image';

  // Use signals for reactive state management
  private imageError = signal(false);
  private validatedSrc = signal('');
  private imageLoader?: HTMLImageElement;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && this.src) {
      this.validateImageUrl();
    } else if (!this.src) {
      // If no src provided, use fallback immediately
      this.imageError.set(true);
      this.validatedSrc.set(this.fallbackSrc);
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    if (this.imageLoader) {
      this.imageLoader.onload = null;
      this.imageLoader.onerror = null;
      this.imageLoader = undefined;
    }
  }

  private validateImageUrl(): void {
    // Start with fallback to prevent broken icons
    this.imageError.set(true);
    this.validatedSrc.set(this.fallbackSrc);

    // Basic URL validation first
    if (!this.isValidImageUrl(this.src)) {
      console.warn(`Invalid image URL rejected: ${this.src}`);
      return; // Keep fallback
    }

    // Cleanup previous loader
    this.cleanup();

    // Test the image URL with timeout
    this.imageLoader = new Image();

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.warn(`Image load timeout for: ${this.src}`);
      this.cleanup();
      this.imageError.set(true);
      this.validatedSrc.set(this.fallbackSrc);
    }, 5000); // 5 second timeout

    this.imageLoader.onload = () => {
      clearTimeout(timeoutId);
      // Image loaded successfully
      console.log(`Image loaded successfully: ${this.src}`);
      this.imageError.set(false);
      this.validatedSrc.set(this.src);
    };

    this.imageLoader.onerror = () => {
      clearTimeout(timeoutId);
      // Image failed to load, keep fallback
      console.warn(`Image failed to load: ${this.src}`);
      this.imageError.set(true);
      this.validatedSrc.set(this.fallbackSrc);
    };

    this.imageLoader.src = this.src;
  }

  private isValidImageUrl(url: string): boolean {
    if (!url || url.trim() === '' || url === 'undefined' || url === 'null') {
      return false;
    }

    // Check for common invalid patterns
    if (url.includes('localhost') && !url.includes(window.location.hostname)) {
      return false;
    }

    // Check for invalid URLs that would cause broken images
    if (url.includes('undefined') || url.includes('null') || url === 'data:') {
      return false;
    }

    // For base64 images, check if they're valid
    if (url.startsWith('data:image/')) {
      return url.length > 20; // Basic check for valid base64
    }

    // Check if URL looks like a valid image URL
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some(ext =>
      url.toLowerCase().includes(ext)
    );

    // Allow URLs that have valid extensions or are HTTP URLs
    return hasValidExtension || url.startsWith('http') || url.startsWith('assets/');
  }

  get hasImageError(): boolean {
    return this.imageError();
  }

  get imageSrc(): string {
    return this.validatedSrc() || this.fallbackSrc;
  }
}
