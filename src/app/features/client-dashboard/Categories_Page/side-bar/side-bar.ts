import {
  Component,
  EventEmitter,
  inject,
  Output,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { DrugService } from '../../../../core/drug/drug-service';
import { IDrug } from '../../../../core/drug/IDrug';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [NgClass],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit, OnDestroy {
  Categories = [
    {
      name: 'Anemia medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png',
    },
    {
      name: 'Anthelmintics',
      icon: 'https://cdn-icons-png.flaticon.com/512/1143/1143553.png',
    },
    {
      name: 'Anti-Parkinson drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/4290/4290854.png',
    },
    {
      name: 'Anti-obesity drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/3307/3307196.png',
    },
    {
      name: 'Antiarrhythmics',
      icon: 'https://cdn-icons-png.flaticon.com/512/254/254022.png',
    },
    {
      name: 'Antibiotic',
      icon: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
    },
    {
      name: 'Anticancer',
      icon: 'https://cdn-icons-png.flaticon.com/512/4388/4388166.png',
    },
    {
      name: 'Anticoagulant',
      icon: 'https://cdn-icons-png.flaticon.com/512/2751/2751725.png',
    },
    {
      name: 'Antidepressants',
      icon: 'https://cdn-icons-png.flaticon.com/512/7660/7660378.png',
    },
    {
      name: 'Antidiabetic',
      icon: 'https://cdn-icons-png.flaticon.com/512/3154/3154587.png',
    },
    {
      name: 'Antidiarrheals',
      icon: 'https://cdn-icons-png.flaticon.com/512/4689/4689162.png',
    },
    {
      name: 'Antidotes',
      icon: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    },
    {
      name: 'Antiemetics',
      icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965573.png',
    },
    {
      name: 'Antiepileptics',
      icon: 'https://cdn-icons-png.flaticon.com/512/831/831682.png',
    },
    {
      name: 'Antifungals',
      icon: 'https://cdn-icons-png.flaticon.com/512/2884/2884565.png',
    },
    {
      name: 'Antigout drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/3523/3523063.png',
    },
    {
      name: 'Antihistamines',
      icon: 'https://cdn-icons-png.flaticon.com/512/10746/10746929.png',
    },
    {
      name: 'Antihypertensive',
      icon: 'https://cdn-icons-png.flaticon.com/512/9953/9953296.png',
    },
    {
      name: 'Antimalarials',
      icon: 'https://cdn-icons-png.flaticon.com/512/4727/4727499.png',
    },
    {
      name: 'Antiparasitics',
      icon: 'https://cdn-icons-png.flaticon.com/512/4472/4472967.png',
    },
    {
      name: 'Antiperspirants',
      icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png',
    },
    {
      name: 'Antipsychotics',
      icon: 'https://cdn-icons-png.flaticon.com/512/1143/1143553.png',
    },
    {
      name: 'Antiulcer drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/4290/4290854.png',
    },
    {
      name: 'Antiviral',
      icon: 'https://cdn-icons-png.flaticon.com/512/3307/3307196.png',
    },
    {
      name: 'Anxiolytics',
      icon: 'https://cdn-icons-png.flaticon.com/512/254/254022.png',
    },
    {
      name: 'Arthritis medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
    },
    {
      name: 'Asthma medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/4388/4388166.png',
    },
    {
      name: 'Burn medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/2751/2751725.png',
    },
    {
      name: 'Cholesterol-lowering drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/7660/7660378.png',
    },
    {
      name: 'Cognitive enhancers',
      icon: 'https://cdn-icons-png.flaticon.com/512/3154/3154587.png',
    },
    {
      name: 'Contraceptives',
      icon: 'https://cdn-icons-png.flaticon.com/512/4689/4689162.png',
    },
    {
      name: 'Cough suppressants',
      icon: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    },
    {
      name: 'Dermatological drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965573.png',
    },
    {
      name: 'Diuretics',
      icon: 'https://cdn-icons-png.flaticon.com/512/831/831682.png',
    },
    {
      name: 'Erectile dysfunction drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/2884/2884565.png',
    },
    {
      name: 'Fertility drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/3523/3523063.png',
    },
    {
      name: 'Heart failure medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/10746/10746929.png',
    },
    {
      name: 'Hormone',
      icon: 'https://cdn-icons-png.flaticon.com/512/9953/9953296.png',
    },
    {
      name: 'Immunostimulants',
      icon: 'https://cdn-icons-png.flaticon.com/512/4727/4727499.png',
    },
    {
      name: 'Immunosuppressants',
      icon: 'https://cdn-icons-png.flaticon.com/512/4472/4472967.png',
    },
    {
      name: 'Laxatives',
      icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png',
    },
    {
      name: 'Menopause medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/1143/1143553.png',
    },
    {
      name: 'Migraine medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/4290/4290854.png',
    },
    {
      name: 'Mucolytics',
      icon: 'https://cdn-icons-png.flaticon.com/512/3307/3307196.png',
    },
    {
      name: 'Muscle relaxants',
      icon: 'https://cdn-icons-png.flaticon.com/512/254/254022.png',
    },
    {
      name: 'NSAID',
      icon: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
    },
    {
      name: 'Neuropathic pain drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/4388/4388166.png',
    },
    {
      name: 'Ophthalmic drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/2751/2751725.png',
    },
    {
      name: 'Osteoporosis drugs',
      icon: 'https://cdn-icons-png.flaticon.com/512/7660/7660378.png',
    },
    {
      name: 'Otic preparations',
      icon: 'https://cdn-icons-png.flaticon.com/512/3154/3154587.png',
    },
    {
      name: 'Prostate medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/4689/4689162.png',
    },
    {
      name: 'Sleep aids',
      icon: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    },
    {
      name: 'Thyroid medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965573.png',
    },
    {
      name: 'Urinary tract medications',
      icon: 'https://cdn-icons-png.flaticon.com/512/831/831682.png',
    },
    {
      name: 'Vaccine',
      icon: 'https://cdn-icons-png.flaticon.com/512/2884/2884565.png',
    },
    {
      name: 'Vasodilators',
      icon: 'https://cdn-icons-png.flaticon.com/512/3523/3523063.png',
    },
  ];

  drugservice: DrugService = inject(DrugService);
  CategoryDrugs: IDrug[] = [];
  selectedCategory: string = '';
  @Output() categorySelected = new EventEmitter<IDrug[]>();

  sidebarVisible = false;
  isSmallScreen = false;

  ngOnInit() {
    this.onclickCategory();
    this.checkScreenSize();
  }

  ngOnDestroy() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
    if (!this.isSmallScreen) {
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = false;
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    console.log('Sidebar toggled:', this.sidebarVisible);
  }

  // Separate method for closing sidebar
  closeSidebar() {
    if (this.isSmallScreen) {
      this.sidebarVisible = false;
      console.log('Sidebar closed');
    }
  }

  onclickCategory(category: string = 'All') {
    console.log('Selected Category:', category);

    // Close sidebar on mobile after category selection
    if (this.isSmallScreen) {
      setTimeout(() => {
        this.closeSidebar();
      }, 150);
    }

    if (category === 'All') {
      this.selectedCategory = '';
      this.drugservice.getRandomDrugs().subscribe({
        next: (data) => {
          this.CategoryDrugs = data; // Handle both array and object responses
          this.categorySelected.emit(this.CategoryDrugs);
          console.log('Random Drugs:', data);
        },
        error: (err) => {
          console.error('Error fetching random drugs:', err);
        },
      });
    } else {
      this.selectedCategory = category;
      this.drugservice.getDrugsByCategory(category).subscribe({
        next: (data) => {
          this.CategoryDrugs = data;
          this.categorySelected.emit(this.CategoryDrugs);
          console.log('Drugs in category:', data);
        },
        error: (err) => {
          console.error('Error fetching drugs by category:', err);
        },
      });
    }
  }
}
