import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, SimpleChanges, computed, signal, effect } from '@angular/core';
import { Ipharmacy } from '../../../../client-dashboard/shared/models/ipharmacy';
import { PharmaciesMangementService } from '../../Service/pharmacies-mangement.service';
import { switchMap } from 'rxjs';
import { AdminDashboardRoutingModule } from '../../../admin-dashboard-routing.module';
import { DocumentViewerComponent } from '../document-viewer/document-viewer.component';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS } from '../../../../../shared/constants/app.constants';

@Component({
  selector: 'app-pending-applications',
  standalone: true,
  imports: [AdminDashboardRoutingModule, DocumentViewerComponent, CommonModule],
  templateUrl: './pending-applications.component.html',
  styleUrl: './pending-applications.component.css',
})
export class PendingApplicationsComponent implements OnInit, OnChanges {
  @Input() pendingPharmacyData: Ipharmacy[] | null = null;
  @Output() refreshData = new EventEmitter<void>();
  @ViewChild(DocumentViewerComponent) documentViewer!: DocumentViewerComponent;

  showDetailsModal: boolean = false;
  selectedPharmacy: Ipharmacy | null = null;
  isLoading = false;
  
  // Convert input to signal for reactivity
  private inputDataSignal = signal<Ipharmacy[] | null>(null);
  
  // Track local changes that haven't been refreshed yet
  private locallyProcessedIds = signal<number[]>([]);

  // Computed that combines service updates with local processing
  computedPendingPharmacies = computed(() => {
    const originalData = this.inputDataSignal();
    const serviceUpdates = this.pharmacyService.pharmacyUpdates();
    const locallyProcessed = this.locallyProcessedIds();
    
    // console.log('Computing pending pharmacies:', {
    //   originalData: originalData?.length || 0,
    //   serviceUpdates: serviceUpdates.length,
    //   locallyProcessed: locallyProcessed.length
    // });
    
    if (!originalData) return [];
    
    // Filter out pharmacies that have been processed locally or by service
    return originalData.filter(pharmacy => {
      // IMPORTANT: Check locally processed FIRST and maintain the filter
      // even when new data arrives from server
      if (locallyProcessed.includes(pharmacy.pharmacyID)) {
        //console.log(`Filtering out locally processed pharmacy ID: ${pharmacy.pharmacyID}`);
        return false;
      }
      
      // Then check service updates
      const serviceUpdate = serviceUpdates.find(u => u.pharmacyId === pharmacy.pharmacyID);
      const shouldKeep = !serviceUpdate || serviceUpdate.newStatus === 2; // 2 = pending
      
      // if (!shouldKeep) {
      //   console.log(`Filtering out pharmacy ID ${pharmacy.pharmacyID} due to service update`);
      // }
      
      return shouldKeep;
    });
  });

  constructor(private pharmacyService: PharmaciesMangementService, private cdr: ChangeDetectorRef) {
    // Effect to trigger change detection when computed value changes
    effect(() => {
      const computed = this.computedPendingPharmacies();
     //console.log('Effect - computed pharmacies count:', computed.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.inputDataSignal.set(this.pendingPharmacyData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pendingPharmacyData']) {
      //console.log('Input changed, updating signal:', this.pendingPharmacyData?.length);
      this.inputDataSignal.set(this.pendingPharmacyData);
      
      // CRITICAL FIX: Only clear locally processed IDs if we're getting 
      // completely fresh data (like after a manual refresh)
      // Don't clear them on every input change as this causes the processed items to reappear
      
      // You can add logic here to determine if this is a "fresh" data load
      // For example, if the parent component passes a flag or if you detect
      // that all previously processed items are no longer in the dataset
    }
  }

  // Add method to manually clear processed IDs when needed
  clearLocallyProcessedIds(): void {
    //console.log('Clearing locally processed IDs');
    this.locallyProcessedIds.set([]);
  }

  viewDetails(pharmacy: Ipharmacy) {
    this.selectedPharmacy = pharmacy;
    //console.log('Selected Pharmacy:', this.selectedPharmacy);
    this.showDetailsModal = true;
  }

  viewDocument(url: string | undefined) {
   // console.log('Document URL:', url);
    if (url) {
      const fullUrl = url.startsWith('http')
        ? url
        : `${APP_CONSTANTS.environment.apiHubsUrl}${url}`;

      this.documentViewer.openViewer(fullUrl);
    }
  }

  closeModal() {
    this.showDetailsModal = false;
    this.selectedPharmacy = null;
  }

  activatePharmacy(pharmacy: Ipharmacy) {
    this.isLoading = true;
    const pharmacyId = pharmacy.pharmacyID;

    this.pharmacyService.confirmPharmacy(pharmacyId).pipe(
      switchMap((confirmResponse) => {
       // console.log('Confirm response:', confirmResponse);
        return this.pharmacyService.changePharmacyUserRole(pharmacyId, 'Pharmacy');
      })
    ).subscribe({
      next: (roleChangeResponse) => {
       // console.log('Role change response:', roleChangeResponse);
        
        // Mark as locally processed for immediate UI update
        const currentProcessed = this.locallyProcessedIds();
        this.locallyProcessedIds.set([...currentProcessed, pharmacyId]);
        
        this.closeModal();
        this.isLoading = false;
        
        // Emit refresh to update all other components
        // Add a small delay to ensure the item stays hidden during the refresh
        setTimeout(() => {
          this.refreshData.emit();
        }, 100);
      },
      error: (error) => {
        //console.error(`Error: ${error.status}, ${error.error}`);
        this.isLoading = false;
      }
    });
  }

  rejectPharmacy(pharmacy: Ipharmacy) {
    this.isLoading = true;
    const pharmacyId = pharmacy.pharmacyID;

    this.pharmacyService.rejectPharmacy(pharmacyId).pipe(
      switchMap((rejectResponse) => {
        //console.log('Reject response:', rejectResponse);
        return this.pharmacyService.changePharmacyUserRole(pharmacyId, 'Suspended');
      })
    ).subscribe({
      next: (roleChangeResponse) => {
        //console.log('Role change response:', roleChangeResponse);
        
        // Mark as locally processed for immediate UI update
        const currentProcessed = this.locallyProcessedIds();
        this.locallyProcessedIds.set([...currentProcessed, pharmacyId]);
        
        this.closeModal();
        this.isLoading = false;
        
        // Emit refresh to update all other components
        // Add a small delay to ensure the item stays hidden during the refresh
        setTimeout(() => {
          this.refreshData.emit();
        }, 100);
      },
      error: (error) => {
        //console.error(`Error: ${error.status}, ${error.error}`);
        this.isLoading = false;
      }
    });
  }
  trackByPharmacyId(index: number, pharmacy: Ipharmacy): string {
  return `${pharmacy.pharmacyID}-${index}`;
}

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}