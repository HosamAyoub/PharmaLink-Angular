import { Component, inject } from '@angular/core';
import { SideBar } from '../side-bar/side-bar';
import { IDrug } from '../../../../core/IDrug';
import { DrugService } from '../../../../core/drug-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
  imports: [SideBar,CommonModule]
})
export class CategoryList 
{
  DrugData: DrugService = inject(DrugService);
  Drugs: IDrug[] = [];

  ReceiveCategoryDrugs(categoryDrugs: IDrug[]) 
  {
    this.Drugs = categoryDrugs;
    console.log('Received Category Drugs:', this.Drugs);
  }
}

