import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../Components/page-header/page-header.component';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { StatusCardComponent } from '../../Dashboard/Components/status-card/status-card.component';
import { Ipharmacy } from '../../../client-dashboard/shared/models/ipharmacy';
import { AdminAnalysisInterface } from '../../Dashboard/Interface/admin-analysis-interface';
import { AdminAnalysisServiceService } from '../../Dashboard/Services/admin-analysis-service.service';
import { PharmacyService } from '../../../client-dashboard/Pharmacies/Service/pharmacy-service';
import { PharmacyManagementComponent } from '../Components/pharmacy-management/pharmacy-management.component';
import { SidebarStateServiceService } from '../../Shared/sidebar-state-service.service';
import { PendingApplicationsComponent } from '../Components/pending-applications/pending-applications.component';

@Component({
  selector: 'app-pharmacies-page',
  standalone: true,
  imports: [PageHeaderComponent, LoadingSpinner, StatusCardComponent,PharmacyManagementComponent,PendingApplicationsComponent],
  templateUrl: './pharmacies-page.component.html',
  styleUrl: './pharmacies-page.component.css'
})
export class PharmaciesPageComponent implements OnInit{
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected activePharmacyData: Ipharmacy[] | null = null;
  protected pendingPharmacyData: Ipharmacy[] | null = null;
  protected suspendedPharmacyData: Ipharmacy[] | null = null;
  protected rejectedPharmacyData: Ipharmacy[] | null = null;
  protected pharmaciesData: AdminAnalysisInterface | null = null;
  protected errorMessage: string | null = null;
  protected loading: boolean = true;
  isSidebarOpen = true;

    constructor(private adminAnalysisService: AdminAnalysisServiceService, private pharmacyService: PharmacyService,private sidebarService: SidebarStateServiceService) { }
   ngOnInit(): void {
    this.sidebarService.isOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
      this.cdr.detectChanges(); // Trigger change detection
    });
    this.loadActivePharmacies();
    this.loadPendingPharmacies();
    this.loadSuspendedPharmacies();
    this.loadRejectedPharmacies()
    this.loadPharmacySummary();
  }

  
  private loadActivePharmacies(): void {
    this.loading = true;
    this.errorMessage = null;
    this.pharmacyService.getActivePharmacies().subscribe({
      next: (data) => {
        this.activePharmacyData = data;
        //console.log('Active Pharmacies Loaded:', this.activePharmacyData);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading pharmacy data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  private loadSuspendedPharmacies(): void {
    this.loading = true;
    this.errorMessage = null;
    this.pharmacyService.getSuspendedPharmacies().subscribe({
      next: (data) => {
        this.suspendedPharmacyData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading suspended pharmacy data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  private loadPendingPharmacies(): void {
    this.loading = true;
    this.errorMessage = null;
    this.pharmacyService.getPendingPharmacies().subscribe({
      next: (data) => {
        this.pendingPharmacyData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
    private loadRejectedPharmacies(): void {
    this.loading = true;
    this.errorMessage = null;
    this.pharmacyService.getRejectedPharmacies().subscribe({
      next: (data) => {
        this.rejectedPharmacyData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadPharmacySummary(): void {
    this.loading = true;
    this.errorMessage = null;
    this.adminAnalysisService.getPharmaciesSummary().subscribe({
      next: (data) => {
        this.pharmaciesData = data;
        //console.log('Summary Loaded;', this.pharmaciesData);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading pharmacy summary';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  get cards() {

    return [
      {
        title: 'Total Pharmacies',
        value: this.pharmaciesData?.pharmacySummary.length || 0,
        icon: 'pharmacy',
        color1: '#DBEAFE',
        color2: 'var(--blue-200)',
        color3: 'var(--blue-200)',    
      },
      {
        title: 'Active Pharmacies',
        value: this.activePharmacyData?.length || 0,
        icon: 'check-true',
        color1: '#DCFCE7',
        color2: 'var(--light-green)',
        color3: 'var(--light-green)',
      },
      {
        title: 'Pending Applications',
        value: this.pendingPharmacyData?.length || 0,
        icon: 'check-pending',
        color1: '#FEF9C3',
        color2: 'var(--orange)',
        color3: 'var(--orange)',
      },      
      {
        title: 'Suspended',
        value:  this.suspendedPharmacyData?.length || 0,
        icon: 'check-false',
        color1: '#FEE2E2',
        color2: 'var(--error-red)',
        color3: 'var(--error-red)',
      },
    ];
  }

}
