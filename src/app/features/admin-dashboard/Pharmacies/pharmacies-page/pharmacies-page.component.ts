import { Component, OnInit, ChangeDetectionStrategy, signal, computed, effect, inject, ViewChild } from '@angular/core';
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
import { PharmaciesMangementService } from '../Service/pharmacies-mangement.service';

@Component({
  selector: 'app-pharmacies-page',
  standalone: true,
  imports: [PageHeaderComponent, LoadingSpinner, StatusCardComponent,PharmacyManagementComponent,PendingApplicationsComponent],
  templateUrl: './pharmacies-page.component.html',
  styleUrl: './pharmacies-page.component.css'
})
export class PharmaciesPageComponent implements OnInit {
  // Inject services
  private adminAnalysisService = inject(AdminAnalysisServiceService);
  private pharmacyService = inject(PharmacyService);
  private sidebarService = inject(SidebarStateServiceService);
  private pharmacyManagementService = inject(PharmaciesMangementService);

  // Signals for pharmacy data
  protected activePharmacyData = signal<Ipharmacy[] | null>(null);
  protected pendingPharmacyData = signal<Ipharmacy[] | null>(null);
  protected suspendedPharmacyData = signal<Ipharmacy[] | null>(null);
  protected rejectedPharmacyData = signal<Ipharmacy[] | null>(null);
  protected pharmaciesData = signal<AdminAnalysisInterface | null>(null);
  @ViewChild(PendingApplicationsComponent) pendingApplicationsComponent!: PendingApplicationsComponent;

  // Method to refresh data (modified to properly handle locally processed items)
  
  // UI state signals
  protected errorMessage = signal<string | null>(null);
  protected loading = signal<boolean>(true);
  protected isSidebarOpen = signal<boolean>(true);

  // Computed signal that applies pharmacy updates to the data
  protected computedActivePharmacies = computed(() => {
    const originalData = this.activePharmacyData();
    const updates = this.pharmacyManagementService.pharmacyUpdates();
    
    if (!originalData || updates.length === 0) return originalData;
    
    return originalData.filter(pharmacy => {
      const update = updates.find(u => u.pharmacyId === pharmacy.pharmacyID);
      // Remove from active if status changed to non-active (not 1)
      return !update || update.newStatus === 1;
    });
  });

  protected computedPendingPharmacies = computed(() => {
    const originalData = this.pendingPharmacyData();
    const updates = this.pharmacyManagementService.pharmacyUpdates();
    
    if (!originalData || updates.length === 0) return originalData;
    
    return originalData.filter(pharmacy => {
      const update = updates.find(u => u.pharmacyId === pharmacy.pharmacyID);
      // Remove from pending if status changed to non-pending (not 2)
      return !update || update.newStatus === 2;
    });
  });

  protected computedSuspendedPharmacies = computed(() => {
    const originalData = this.suspendedPharmacyData();
    const originalActive = this.activePharmacyData();
    const originalPending = this.pendingPharmacyData();
    const updates = this.pharmacyManagementService.pharmacyUpdates();
    
    if (updates.length === 0) return originalData;
    
    // Start with original suspended data
    let result = originalData ? [...originalData] : [];
    
    // Add pharmacies that were moved to suspended status
    updates.forEach(update => {
      if (update.newStatus === 0) { // 0 is suspended
        // Find the pharmacy in active or pending arrays
        const pharmacy = originalActive?.find(p => p.pharmacyID === update.pharmacyId) ||
                         originalPending?.find(p => p.pharmacyID === update.pharmacyId);
        
        if (pharmacy && !result.find(p => p.pharmacyID === pharmacy.pharmacyID)) {
          result.push({ ...pharmacy, status: 0 });
        }
      }
    });
    
    // Remove pharmacies that were moved from suspended to other status
    result = result.filter(pharmacy => {
      const update = updates.find(u => u.pharmacyId === pharmacy.pharmacyID);
      return !update || update.newStatus === 0;
    });
    
    return result;
  });

  protected computedRejectedPharmacies = computed(() => {
    const originalData = this.rejectedPharmacyData();
    const originalPending = this.pendingPharmacyData();
    const updates = this.pharmacyManagementService.pharmacyUpdates();
    
    if (updates.length === 0) return originalData;
    
    // Start with original rejected data
    let result = originalData ? [...originalData] : [];
    
    // Add pharmacies that were moved to rejected status
    updates.forEach(update => {
      if (update.newStatus === 3) { // 3 is rejected
        // Find the pharmacy in pending array
        const pharmacy = originalPending?.find(p => p.pharmacyID === update.pharmacyId);
        
        if (pharmacy && !result.find(p => p.pharmacyID === pharmacy.pharmacyID)) {
          result.push({ ...pharmacy, status: 3 });
        }
      }
    });
    
    // Remove pharmacies that were moved from rejected to other status
    result = result.filter(pharmacy => {
      const update = updates.find(u => u.pharmacyId === pharmacy.pharmacyID);
      return !update || update.newStatus === 3;
    });
    
    return result;
  });

  constructor() {
    // Effect to handle sidebar state changes
    effect(() => {
      this.sidebarService.isOpen$.subscribe(isOpen => {
        this.isSidebarOpen.set(isOpen);
      });
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData(): void {
    this.loadActivePharmacies();
    this.loadPendingPharmacies();
    this.loadSuspendedPharmacies();
    this.loadRejectedPharmacies();
    this.loadPharmacySummary();
  }

  private loadActivePharmacies(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    
    this.pharmacyService.getActivePharmacies().subscribe({
      next: (data) => {
        this.activePharmacyData.set(data);
        this.loading.set(false);
        console.log('Active pharmacies loaded:', data); 
      },
      error: (error) => {
        this.errorMessage.set('Error loading pharmacy data');
        this.loading.set(false);
      }
    });
  }

  private loadSuspendedPharmacies(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    
    this.pharmacyService.getSuspendedPharmacies().subscribe({
      next: (data) => {
        this.suspendedPharmacyData.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading suspended pharmacy data');
        this.loading.set(false);
      }
    });
  }

  private loadPendingPharmacies(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    
    this.pharmacyService.getPendingPharmacies().subscribe({
      next: (data) => {
        this.pendingPharmacyData.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.pendingPharmacyData.set([]);
        this.errorMessage.set(error.message);
        this.loading.set(false);
      }
    });
  }

  private loadRejectedPharmacies(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    
    this.pharmacyService.getRejectedPharmacies().subscribe({
      next: (data) => {
        this.rejectedPharmacyData.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      }
    });
  }

  private loadPharmacySummary(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    
    this.adminAnalysisService.getPharmaciesSummary().subscribe({
      next: (data) => {
        this.pharmaciesData.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading pharmacy summary');
        this.loading.set(false);
      }
    });
  }

  // Method to refresh data (can be called when needed)
  refreshData(): void {
    console.log('Refreshing all data...');
    // Clear pharmacy updates first to reset the computed signals
    this.pharmacyManagementService.clearAllPharmacyUpdates();
    if (this.pendingApplicationsComponent) {
    this.pendingApplicationsComponent.clearLocallyProcessedIds();
  }
    this.loadAllData();
  }
  
  get cards() {

    return [
      {
        title: 'Total Pharmacies',
        value: this.pharmaciesData()?.pharmacySummary.length || 0,
        icon: 'pharmacy',
        color1: '#DBEAFE',
        color2: 'var(--blue-200)',
        color3: 'var(--blue-200)',    
      },
      {
        title: 'Active Pharmacies',
        value: this.activePharmacyData()?.length || 0,
        icon: 'check-true',
        color1: '#DCFCE7',
        color2: 'var(--light-green)',
        color3: 'var(--light-green)',
      },
      {
        title: 'Pending Applications',
        value: this.pendingPharmacyData()?.length || 0,
        icon: 'check-pending',
        color1: '#FEF9C3',
        color2: 'var(--orange)',
        color3: 'var(--orange)',
      },      
      {
        title: 'Suspended',
        value:  this.suspendedPharmacyData()?.length || 0,
        icon: 'check-false',
        color1: '#FEE2E2',
        color2: 'var(--error-red)',
        color3: 'var(--error-red)',
      },
    ];
  }

}
