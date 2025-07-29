import {
  Component,
  ContentChildren,
  EventEmitter,
  inject,
  output,
  Output,
  viewChild,
} from '@angular/core';
import { SideBar } from  '../../shared/components/side-bar/side-bar';
import { IDrug } from '../../../../core/drug/IDrug';
import { DrugService } from '../../../../core/drug/drug-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
  imports: [SideBar, CommonModule, RouterLink],
})
export class CategoryList {
  DrugData: DrugService = inject(DrugService);
  Drugs: IDrug[] = [];

  ReceiveCategoryDrugs(categoryDrugs: IDrug[]) {
    this.Drugs = categoryDrugs;
    console.log('Received Category Drugs:', this.Drugs);
  }

  SendDrugSelected(drug: IDrug) {
    console.log('Selected Drug:', drug);
  }



}
