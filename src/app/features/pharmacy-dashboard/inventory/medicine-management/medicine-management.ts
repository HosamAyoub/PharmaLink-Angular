<<<<<<< HEAD
import { ChangeDetectorRef, Component, inject, ViewChild, ElementRef } from '@angular/core';
import { MedicineService } from './../Services/medicine-service';
import { IPharmaProduct } from '../Models/ipharma-product';
import { IPharmaInventoryStatus } from '../Models/ipharma-inventory-status';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-medicine-management',
  standalone: true,
  imports: [CommonModule , RouterLink],
=======
import { Component } from '@angular/core';

@Component({
  selector: 'app-medicine-management',
>>>>>>> main
  templateUrl: './medicine-management.html',
  styleUrls: ['./medicine-management.css']
})
export class MedicineManagement {
<<<<<<< HEAD
  medicineService: MedicineService = inject(MedicineService);

  Status!: IPharmaInventoryStatus;
  medicines: IPharmaProduct[] = [];
  Result: IPharmaProduct[] = [];
  @ViewChild('filterSelect') el!: ElementRef;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const pharmacyId = 1;
    // load inventory stats
    this.medicineService.getPharmacyInventoryStatusByID(pharmacyId).subscribe((status: any) => 
    {
      this.Status = status.data;
      this.cd.detectChanges();
    });

    // load initial medicine list
    this.loadMedicines('');
  }

  onSearchChange(searchTerm: string) {
    this.loadMedicines(searchTerm);
  }

  loadMedicines(query: string) 
  {
    const pharmacyId = 1;
    const pageNumber = 1;
    const pageSize = 100;
    console.log(`Loading medicines with query: ${query}`);
    if (query=== '') 
    {
      this.medicineService.getAllPharmacyMedicines(pharmacyId, pageNumber, pageSize).subscribe((res: any) => {
        this.Result = res.data ?? [];
        this.onFilterChange(this.el.nativeElement.value);
        this.cd.detectChanges();
      });
    }
    else{
       this.medicineService.SearchMedicines(query, pharmacyId, pageNumber, pageSize).subscribe((res: any) => {
      this.Result = res.data ?? [];
      console.log(this.Result);
      this.onFilterChange(this.el.nativeElement.value);
      this.cd.detectChanges();
    },
    (error: any) => {
      this.Result = [];
      this.onFilterChange(this.el.nativeElement.value);
    });
    }
  }

  onFilterChange(filter: string) {
    if (filter === 'In Stock') {
      this.medicines = this.Result.filter(medicine => medicine.quantityAvailable > 0);
    } else if (filter === 'Out of Stock') {
      this.medicines = this.Result.filter(medicine => medicine.quantityAvailable === 0);
    } else if (filter === 'Low Stock') {
      this.medicines = this.Result.filter(medicine => medicine.quantityAvailable > 0 && medicine.quantityAvailable < 12);
    } else if (filter === 'All') {
      this.medicines = this.Result;
    }
    this.cd.detectChanges();
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
=======
  medicines = [
    {
      name: 'Paracetamol 500mg',
      subname: 'Acetaminophen',
      category: 'Pain Relief',
      price: 5.99,
      quantity: 150
    },
    {
      name: 'Vitamin D3 1000IU',
      subname: 'Cholecalciferol',
      category: 'Vitamins',
      price: 12.99,
      quantity: 75
    },
    {
      name: 'Ibuprofen 400mg',
      subname: 'Ibuprofen',
      category: 'Pain Relief',
      price: 7.50,
      quantity: 0
    },
    {
      name: 'Multivitamin Complex',
      subname: 'Multiple Vitamins',
      category: 'Vitamins',
      price: 18.99,
      quantity: 45
    }
  ];

  // Calculated properties for the stats section
  get totalMedicines(): number {
    return this.medicines.length;
  }

  get inStock(): number {
    return this.medicines.filter(med => med.quantity > 0).length;
  }

  get outOfStock(): number {
    return this.medicines.filter(med => med.quantity === 0).length;
  }

  get lowStock(): number {
    return this.medicines.filter(med => med.quantity > 0 && med.quantity < 10).length;
>>>>>>> main
  }
}
