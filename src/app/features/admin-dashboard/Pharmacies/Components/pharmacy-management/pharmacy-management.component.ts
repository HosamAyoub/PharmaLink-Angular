import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Ipharmacy } from '../../../../client-dashboard/shared/models/ipharmacy';
import { AdminAnalysisInterface } from '../../../Dashboard/Interface/admin-analysis-interface';
import { PharmacyDisplayData } from '../../Interface/pharmacy-display-data'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PharmaciesMangementService } from '../../Service/pharmacies-mangement.service';
import { finalize, switchMap } from 'rxjs';


@Component({
  selector: 'app-pharmacy-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pharmacy-management.component.html',
  styleUrl: './pharmacy-management.component.css'
})
export class PharmacyManagementComponent implements OnInit, OnChanges {
  @Input() activePharmacyData: Ipharmacy[] | null = null;
  @Input() pendingPharmacyData: Ipharmacy[] | null = null;
  @Input() suspendedPharmacyData: Ipharmacy[] | null = null;
  @Input() rejectedPharmacyData: Ipharmacy[] | null = null;
  @Input() pharmaciesData: AdminAnalysisInterface | null = null;
  @Output() refreshData = new EventEmitter<void>();

  // Component state
  searchTerm: string = '';
  selectedStatus: string = 'all';
  allPharmacies: PharmacyDisplayData[] = [];
  filteredPharmacies: PharmacyDisplayData[] = [];
  showDetailsModal: boolean = false;
  selectedPharmacy: PharmacyDisplayData | null = null;
  isLoading = false;

  constructor(private pharmacyService: PharmaciesMangementService) { }

  ngOnInit() {
    this.buildPharmacyData();
    this.filterPharmacies();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activePharmacyData'] || changes['pendingPharmacyData'] ||
      changes['suspendedPharmacyData'] || changes['rejectedPharmacyData'] ||
      changes['pharmaciesData']) {
      this.buildPharmacyData();
      this.filterPharmacies();
    }
  }

  private buildPharmacyData() {
    this.allPharmacies = [];

    // Combine all pharmacy data
    const allData = [
      ...(this.activePharmacyData || []),
      ...(this.pendingPharmacyData || []),
      ...(this.suspendedPharmacyData || []),
      ...(this.rejectedPharmacyData || [])
    ];

    // Transform data for display
    allData.forEach(pharmacy => {
      const summary = this.pharmaciesData?.pharmacySummary.find(
        s => s.pharmacyID === pharmacy.pharmacyID
      );
      const displayPharmacy: PharmacyDisplayData = {
        ...pharmacy,
        license: `LIC-2023-${String(pharmacy.pharmacyID).padStart(3, '0')}`,
        totalOrders: summary?.totalOrders || 0,
        totalRevenue: summary?.totalRevenue || 0,
        totalMedicineInStock: summary?.totalMedicineInStock || 0
      };

      this.allPharmacies.push(displayPharmacy);
    });
  }
  onSearch() {
    this.filterPharmacies();
  }

  onStatusFilter() {
    this.filterPharmacies();
  }

  private filterPharmacies() {
    let filtered = [...this.allPharmacies];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(term) ||
        pharmacy.address.toLowerCase().includes(term) ||
        pharmacy.ownerName?.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (this.selectedStatus !== 'all') {
      const statusMap: { [key: string]: number } = {
        'active': 1,
        'pending': 2,
        'suspended': 0,
        'rejected': 3
      };
      filtered = filtered.filter(pharmacy => pharmacy.status === statusMap[this.selectedStatus]);
    }

    this.filteredPharmacies = filtered;
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'status-active';
      case 0: return 'status-pending';
      case 3: return 'status-suspended';
      case 2: return 'status-rejected';
      default: return 'status-pending';
    }
  }

  getStatusText(status: number | undefined): string {
    switch (status) {
      case 1: return 'Active';
      case 2: return 'Pending';
      case 0: return 'Suspended';
      case 3: return 'Rejected';
      default: return 'Active';
    }
  }

  viewDetails(pharmacy: PharmacyDisplayData) {
    this.selectedPharmacy = pharmacy;
    this.showDetailsModal = true;
  }

  closeModal() {
    this.showDetailsModal = false;
    this.selectedPharmacy = null;
  }
  suspendPharmacy(pharmacy: PharmacyDisplayData) {
  if (!pharmacy) return;

  this.isLoading = true;
  const pharmacyId = pharmacy.pharmacyID;

  this.pharmacyService.suspendPharmacy(pharmacyId).pipe(
    switchMap((suspendResponse) => {
      console.log('Suspend response:', suspendResponse);
      return this.pharmacyService.changePharmacyUserRole(pharmacyId, 'Suspended');
    })
  ).subscribe({
    next: (roleChangeResponse) => {
      console.log('Role change response:', roleChangeResponse);
      // Update the local state immediately for better UX
      pharmacy.status = 0; // Assuming 0 is suspended status
      this.reloadData();
      this.closeModal();
    },
    error: (error) => {
      console.error(`Error: ${error.status}, ${error.error}`);
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

activatePharmacy(pharmacy: PharmacyDisplayData) {
  this.isLoading = true;
  const pharmacyId = pharmacy.pharmacyID;

  this.pharmacyService.confirmPharmacy(pharmacyId).pipe(
    switchMap((confirmResponse) => {
      console.log('Confirm response:', confirmResponse);
      return this.pharmacyService.changePharmacyUserRole(pharmacyId, 'Pharmacy');
    })
  ).subscribe({
    next: (roleChangeResponse) => {
      console.log('Role change response:', roleChangeResponse);
      // Update the local state immediately for better UX
      pharmacy.status = 1; // Assuming 1 is active status
      this.reloadData();
      this.closeModal();
    },
    error: (error) => {
      console.error(`Error: ${error.status}, ${error.error}`);
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
  private reloadData() {
  if (this.refreshData) {
    this.refreshData.emit();
  }
  this.buildPharmacyData();
  this.filterPharmacies();
}


  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
