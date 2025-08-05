import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category',
  imports: [RouterLink, CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category {
   @Input() category!: ICategory ;
}
