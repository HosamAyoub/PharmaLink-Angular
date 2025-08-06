import { ChangeDetectorRef, Component, inject, ViewChild, ElementRef } from '@angular/core';
import { MedicineService } from './../Services/medicine-service';
import { IMedicine } from './../Models/imedicine';
import { IPharmaInventoryStatus } from '../Models/ipharma-inventory-status';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-medicine-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './medicine-management.html',
  styleUrls: ['./medicine-management.css']
})
export class MedicineManagement {
  medicineService: MedicineService = inject(MedicineService);

  Status!: IPharmaInventoryStatus;
  medicines: IMedicine[] = [];
  Result: IMedicine[] = [];
  @ViewChild('filterSelect') el!: ElementRef;
  accountId: number = 0;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUserDataFromToken();
    // load inventory stats
    this.getPharmacyStatus();
    // load all medicines
    this.loadMedicines('');
  }


  getUserDataFromToken() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      return;
    }
    const userData = JSON.parse(userDataString);
    const token = userData._token;
    const claims = jwtDecode(token) as Record<string, any>;
    this.accountId = claims['pharmacy_id'];
  }

  getPharmacyStatus() {
    this.medicineService.getPharmacyInventoryStatusByID().subscribe((status: any) => {
      this.Status = status.data;
      this.cd.detectChanges();
    });
  }


  onSearchChange(searchTerm: string) {
    this.loadMedicines(searchTerm);
  }

  loadMedicines(query: string) {
    const pageNumber = 1;
    const pageSize = 100;
    console.log(`Loading medicines with query: ${query}`);
    if (query === '') {
      this.medicineService.getAllPharmacyMedicines(this.accountId, pageNumber, pageSize).subscribe((res: any) => {
        this.Result = res.data.items.map((item: any) => ({
          pharmaproduct: item,
          isediting: false as boolean,
          available: item.quantityAvailable > 0
        }));
        console.log('Medicines loaded:', res.data.items);
        this.onFilterChange(this.el.nativeElement.value);
      });
    }
    else {
      this.medicineService.SearchMedicines(query, pageNumber, pageSize).subscribe((res: any) => {
        this.Result = res.data.map((item: any) => ({
          pharmaproduct: item,
          isediting: false as boolean,
          available: item.quantityAvailable > 0
        }));
        this.onFilterChange(this.el.nativeElement.value);
      },
        (error: any) => {
          this.Result = [];
          this.onFilterChange(this.el.nativeElement.value);
        });
    }
  }

  onFilterChange(filter: string) {
    if (filter === 'In Stock') {
      this.medicines = this.Result.filter(medicine => medicine.pharmaproduct.quantityAvailable > 0);
    } else if (filter === 'Out of Stock') {
      this.medicines = this.Result.filter(medicine => medicine.pharmaproduct.quantityAvailable === 0);
    } else if (filter === 'Low Stock') {
      this.medicines = this.Result.filter(medicine => medicine.pharmaproduct.quantityAvailable > 0 && medicine.pharmaproduct.quantityAvailable < 12);
    } else if (filter === 'All') {
      this.medicines = this.Result;
    }
    this.cd.detectChanges();
  }

  editMedicine(medicine: IMedicine) {
    medicine.isediting = !medicine.isediting;
  }

  updateMedicine(medicine: IMedicine) {
    const updatedQuantity = parseInt((document.getElementById(`quantity-${medicine.pharmaproduct.drugId}`) as HTMLInputElement).value);
    const updatedPrice = parseFloat((document.getElementById(`price-${medicine.pharmaproduct.drugId}`) as HTMLInputElement).value);

    this.medicineService.EditPharmacyStockProduct(medicine.pharmaproduct.drugId, updatedPrice, updatedQuantity)
      .subscribe(() => {
        medicine.pharmaproduct.quantityAvailable = updatedQuantity;
        medicine.pharmaproduct.price = updatedPrice;
        medicine.isediting = false;
        medicine.available = updatedQuantity > 0;
      });
  }

  deleteMedicine(medicine: IMedicine) {
    this.medicineService.deletePharmacyStockProduct(medicine.pharmaproduct.drugId)
      .subscribe(() => {
        console.log(`Deleted medicine with ID: ${medicine.pharmaproduct.drugId}`);
        this.medicines = this.medicines.filter(m => m.pharmaproduct.drugId !== medicine.pharmaproduct.drugId);
        this.Result = this.Result.filter(m => m.pharmaproduct.drugId !== medicine.pharmaproduct.drugId);
        this.cd.detectChanges();
        this.getPharmacyStatus();
      }, (error) => {
        console.error('Error deleting medicine:', error);
      });
  }


  get totalMedicines(): number {
    return this.Status?.totalCount ?? 0;
  }

  get inStock(): number {
    return this.Status?.inStockCount ?? 0;
  }

  get outOfStock(): number {
    return this.Status?.outOfStockCount ?? 0;
  }

  get lowStock(): number {
    return this.Status?.lowStockCount ?? 0;
  }
}
