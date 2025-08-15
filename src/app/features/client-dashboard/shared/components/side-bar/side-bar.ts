import {
  Component,
  EventEmitter,
  inject,
  Output,
  OnInit,
  OnDestroy,
  HostListener,
  output,
  Input,
  signal,
} from '@angular/core';
// import { IFavDrug } from '../../../../core/drug/IFavDrug';
// import { DrugService } from '../../../../core/drug/drug-service';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DrugService } from '../../../Categories_Page/service/drug-service';
import { IDrug } from '../../../Categories_Page/models/IDrug';
import { CategoriesData } from '../../../../../shared/data/categories-data';

@Component({
  selector: 'app-side-bar',
  imports: [NgClass, CommonModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.css'],
})
export class SideBar implements OnInit, OnDestroy {
  Categories = CategoriesData;

  drugservice: DrugService = inject(DrugService);
  CategoryDrugs: IDrug[] = [];
  @Input() selectedCategoryInput = '';
  selectedCategory = signal('');
  @Output() categorySelected = new EventEmitter<IDrug[]>();
  @Output() categoryNameSelected: EventEmitter<string> = new EventEmitter<string>();

  sidebarVisible = false;
  isSmallScreen = window.innerWidth < 768;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.selectedCategory.set(
      this.route.snapshot.paramMap.get('categoryName') || ''
    );
  }

  ngOnInit() {
    this.onclickCategory();
  }

  ngOnDestroy() {}


  toggleSidebar() {
    this.sidebarVisible = true;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  onclickCategory(category: string = this.route.snapshot.paramMap.get('categoryName') || '') {
    this.categoryNameSelected.emit(category);
    this.selectedCategory.set(category);
    if (this.isSmallScreen) {
      setTimeout(() => {
        this.closeSidebar();
      }, 150);
    }
  }
}
