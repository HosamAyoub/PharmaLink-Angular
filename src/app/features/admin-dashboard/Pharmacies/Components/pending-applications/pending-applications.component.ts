import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Ipharmacy } from '../../../../client-dashboard/shared/models/ipharmacy';
import { PharmaciesMangementService } from '../../Service/pharmacies-mangement.service';
import { switchMap } from 'rxjs';
import { AdminDashboardRoutingModule } from "../../../admin-dashboard-routing.module";
import { DocumentViewerComponent } from '../document-viewer/document-viewer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending-applications',
  standalone: true,
  imports: [AdminDashboardRoutingModule, DocumentViewerComponent,CommonModule],
  templateUrl: './pending-applications.component.html',
  styleUrl: './pending-applications.component.css'
})
export class PendingApplicationsComponent {
  @Input() pendingPharmacyData: Ipharmacy[] | null = null;
  @Output() refreshData = new EventEmitter<void>();
  @ViewChild(DocumentViewerComponent) documentViewer!: DocumentViewerComponent;



  showDetailsModal: boolean = false;
  selectedPharmacy: Ipharmacy | null = null;
  isLoading = false;

  constructor(private pharmacyService: PharmaciesMangementService) { }

  viewDetails(pharmacy: Ipharmacy) {
    this.selectedPharmacy = pharmacy;
    console.log('Selected Pharmacy:', this.selectedPharmacy);
    this.showDetailsModal = true;
  }
  viewDocument(url: string| undefined) {
    // Make sure the URL is complete
    console.log('Document URL:', url);
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:5278${url}`;
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
  rejectPharmacy(pharmacy: Ipharmacy) {
    this.isLoading = true;
    const pharmacyId = pharmacy.pharmacyID;

    this.pharmacyService.rejectPharmacy(pharmacyId).pipe(
      switchMap((confirmResponse) => {
        console.log('Confirm response:', confirmResponse);
        return this.pharmacyService.changePharmacyUserRole(pharmacyId, 'Suspended');
      })
    ).subscribe({
      next: (roleChangeResponse) => {
        console.log('Role change response:', roleChangeResponse);
        // Update the local state immediately for better UX
        pharmacy.status = 3; // Assuming 1 is active status
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

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  reloadData() {
    if (this.refreshData) {
      this.refreshData.emit();
    }
  }


}
