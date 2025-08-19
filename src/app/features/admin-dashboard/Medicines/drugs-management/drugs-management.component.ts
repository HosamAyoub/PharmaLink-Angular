import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { DrugDetailsService } from '../../../client-dashboard/Details/service/drug-details-service';
import { MedicineService } from '../../../pharmacy-dashboard/inventory/Services/medicine-service';
import { CategoriesData } from '../../../../shared/data/categories-data';
import { CommonModule } from '@angular/common';
import { IDrugDetails } from '../../../client-dashboard/Details/model/IDrugDetials';
import { FirstWordPipe } from './Pipes/first-word.pipe';
import { AdminService } from './Services/admin.service';
import { FormsModule } from '@angular/forms';
import { AdminSignalRService } from '../../Shared/admin-signal-r.service';
import { DrugStatus } from '../../../../shared/enums/drug-status';
import { AdminNotificationsService } from '../../Shared/admin-notifications.service';

interface ResponseStatus {
  approved: number;
  drugRequests: any[];
  no_Categories: number;
  requests: number;
}

@Component({
  selector: 'app-drugs-management',
  standalone: true,
  imports: [CommonModule, FirstWordPipe, FormsModule],
  templateUrl: './drugs-management.component.html',
  styleUrls: ['./drugs-management.component.css']
})
export class DrugsManagementComponent {

  NewDrug: IDrugDetails = {} as IDrugDetails;
  selectedMedicine: IDrugDetails = {} as IDrugDetails;
  isEditMode = false;
  medicines: IDrugDetails[] = [];
  Result: any[] = [];
  Categories: any[] = CategoriesData;
  DrugsReq: any[] = [];
  drugDetailsService: DrugDetailsService = inject(DrugDetailsService);
  medicineService: MedicineService = inject(MedicineService);
  adminService: AdminService = inject(AdminService);
  @ViewChild('filterSelect') filterselect!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  Status: ResponseStatus = {} as ResponseStatus;
  Active_Pharmacies: number = 0;
  AdminSignalRService: AdminSignalRService = inject(AdminSignalRService);

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // load inventory stats
    this.getStatus();
    this.getActivePharmacies();
    this.AdminSignalRService.startConnection();
    this.AdminSignalRService.receiveRequestsFromPharmacy().subscribe(() => {
      this.getStatus();
    });
  }

  getStatus() {
    this.adminService.getDrugStatistics().subscribe((res: any) => {
      this.Status = res;
      this.DrugsReq = res.drugRequests;
      console.log(res);
      this.cd.detectChanges();
    }, (error) => {
      console.error('Error fetching drug statistics:', error);
    });
  }

  getActivePharmacies() {
    this.adminService.getActivePharmacies().subscribe((res: any) => {
      this.Active_Pharmacies = res.length;
      console.log(res);
      this.cd.detectChanges();
    });
  }

  onSearchChange(searchTerm: any) {
    this.loadMedicines(searchTerm);
  }

  loadMedicines(searchTerm: string) {
    if (searchTerm) {
      this.medicineService.SearchForDrugs(searchTerm).subscribe((med) => {
        this.medicines = med;
        this.onFilterChange();
        this.cd.detectChanges();
      });
    }
    else {
      this.medicines = [];
    }
  }

  onFilterChange() {
    if (this.filterselect.nativeElement.value !== 'All') {
      this.medicines = this.medicines.filter(medicine => medicine.category === this.filterselect.nativeElement.value);
    }
  }


  get totalMedicines(): number {
    return this.Status?.approved ?? 0;
  }

  get No_Categories(): number {
    return this.Status?.no_Categories ?? 0;
  }

  get requests(): number {
    return this.Status?.requests ?? 0;
  }

  get ActivePharmacies(): number {
    return this.Active_Pharmacies ?? 0;
  }

  deleteDrug(drugId: number) {
    this.adminService.deleteDrug(drugId).subscribe({
      next: () => {
        // Handle successful deletion
        this.DrugsReq = this.DrugsReq.filter(r => r !== drugId);
        this.getStatus();
      },
      error: (err) => {
        // Handle error
        console.error('Error deleting drug request:', err);
      }
    });
    this.loadMedicines(this.searchInput.nativeElement.value);
  }

  rejectRequest(req: any) {
    req.newDrug.drugStatus = DrugStatus.Rejected;
    this.adminService.updateDrug(req.newDrug).subscribe({
      next: () => {
        // Handle successful deletion
        this.DrugsReq = this.DrugsReq.filter(r => r !== req.newDrug.drugID);
        this.getStatus();
      },
      error: (err) => {
        console.error('Error deleting drug request:', err);
      }
    });

    console.log(req.pharmacy);
    this.AdminSignalRService.sendRejectionToPharmacy(req.pharmacy.pharmacy_Id.toString(), "Request rejected").then(() => {
      console.log("Rejection sent to pharmacy");
      this.cd.detectChanges();
    });
  }

  acceptRequest(req: IDrugDetails) {
    this.selectedMedicine = req;
    req.drugStatus = 1; // Set status to Approved
  }

  openModal(medicine: IDrugDetails, editMode: boolean) {
    this.selectedMedicine = medicine;
    this.isEditMode = editMode;
  }

  saveChanges() {
    console.log('saved:', this.selectedMedicine);
    if (this.selectedMedicine.drugID) {
      this.adminService.updateDrug(this.selectedMedicine).subscribe({
        next: () => {
          // Handle successful update
          this.AdminSignalRService.sendAcceptanceToAll("Request accepted").then(() => {
            console.log("Acceptance sent to all");
            this.cd.detectChanges();
          });
          this.closeModal();
          this.getStatus();
          this.DrugsReq = this.DrugsReq.filter(r => r.drugID !== this.selectedMedicine.drugID);
          console.log('Drug updated successfully:', this.selectedMedicine);
        },
        error: (err) => {
          // Handle error
          console.error('Error updating drug:', err);
        }
      });
    } else {
      this.adminService.saveNewDrug(this.selectedMedicine).subscribe({
        next: () => {
          // Handle successful save
          this.closeModal();
          this.getStatus();
          console.log('New drug saved successfully:', this.selectedMedicine);
        },
        error: (err) => {
          // Handle error
          console.error('Error saving new drug:', err);
        }
      });
    }
    this.isEditMode = false;
    this.loadMedicines(this.searchInput.nativeElement.value);
  }
  closeModal() {
    this.isEditMode = false;
  }

}
