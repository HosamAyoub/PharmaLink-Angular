import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { DrugDetailsService } from '../../../client-dashboard/Details/service/drug-details-service';
import { MedicineService } from '../../../pharmacy-dashboard/inventory/Services/medicine-service';
import { CategoriesData } from '../../../../shared/data/categories-data';
import { CommonModule } from '@angular/common';
import { IDrugDetails } from '../../../client-dashboard/Details/model/IDrugDetials';
import { FirstWordPipe } from './Pipes/first-word.pipe';
import { AdminService } from './Services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drugs-management',
  standalone: true,
  imports: [CommonModule, FirstWordPipe , FormsModule],
templateUrl: './drugs-management.component.html',
  styleUrls: ['./drugs-management.component.css']
})
export class DrugsManagementComponent {

  NewDrug!: IDrugDetails;
  Status!: any;
  selectedMedicine: IDrugDetails  = {} as IDrugDetails;
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

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // load inventory stats
    this.getStatus();
  }




  getStatus() {
    this.adminService.getDrugStatistics().subscribe((res) => {
      this.Status = res;
      this.DrugsReq = res.drugRequests;
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
    else{
      this.medicines=[];
    }
  }

  onFilterChange() {
    if (this.filterselect.nativeElement.value !== 'All') {
      this.medicines = this.medicines.filter(medicine => medicine.category === this.filterselect.nativeElement.value);
    }
  }

  editMedicine(Medicine: any) {

  }

  updateMedicine(Medicine: any) {

  }



  deleteMedicine(Medicine: any) {

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
    return this.Status?.activePharmacies ?? 0;
  }

  deleteDrug(drug: IDrugDetails) {
    // Implement the logic to delete drug
  }

  rejectRequest(req: any) {

  }

  acceptRequest(req: any) {

  }

  


  openModal(medicine: IDrugDetails, editMode: boolean) {
    this.selectedMedicine = medicine;
    this.isEditMode = editMode;
  }

  saveChanges() {
    console.log('saved:', this.selectedMedicine);
    this.isEditMode = false;
  }

}
