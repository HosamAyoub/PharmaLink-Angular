import { Component } from '@angular/core';
import { Search } from '../search/search';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  imports: [Search],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider {
  constructor(private router: Router) {}
  goToDrugsPage() {
    this.router.navigate(['/client/products']);
  }
}
