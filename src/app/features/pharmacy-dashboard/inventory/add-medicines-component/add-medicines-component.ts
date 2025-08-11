// add-medicines.component.ts
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicineService } from '../Services/medicine-service';
import { IDrugDetails } from '../../../client-dashboard/Details/model/IDrugDetials';
import { DrugService } from '../../../client-dashboard/Categories_Page/service/drug-service';
import { IAddToStock } from '../Models/iadd-to-stock';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-add-medicines',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './add-medicines-component.html',
  styleUrls: ['./add-medicines-component.css']
})
export class AddMedicinesComponent implements OnInit {

  @ViewChild('searchInput') searchinput!: ElementRef;
  selectedMedicines: IAddToStock[] = [];
  filteredMedicines: IDrugDetails[] = [];
  medicineService: MedicineService = inject(MedicineService);
  drugservice: DrugService = inject(DrugService);


  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.onSearchChange("Antibiotic");
    this.medicineService.updatePharmacyStockList();
  }

  onSearchChange(query: string) {
    if (query === '' ) {
      this.filteredMedicines = [];
    }
    else {
      this.medicineService.SearchForDrugs(query).subscribe(results => {
        this.filteredMedicines = results;
        this.cd.detectChanges();
      }, (error: any) => {
        this.filteredMedicines = [];
      });
    }

  }

  onMedicineClick(medicine: IDrugDetails) {
    if (this.selectedMedicines.some(m => m.drugdetails.drugID === medicine.drugID)) {
      this.selectedMedicines = this.selectedMedicines.filter(m => m.drugdetails.drugID !== medicine.drugID);
    }
    else if (!this.medicineService.PharmacyStockList().some(m => m.drugId === medicine.drugID)) {
      this.selectedMedicines.push({ drugdetails: medicine, quantity: 0, price: 1 });
    }
  }


  removeMedicine(medicine: IAddToStock) {
    this.selectedMedicines = this.selectedMedicines.filter(m => m.drugdetails.drugID !== medicine.drugdetails.drugID);
  }


  onAddToStock() {
    this.medicineService.AddPharmacyStockProduct(this.selectedMedicines).subscribe(
      response => {
        console.log('Stock added successfully:', response);
        this.selectedMedicines = [];
        this.onSearchChange(this.searchinput.nativeElement.value);
        this.medicineService.updatePharmacyStockList();
        this.cd.detectChanges();
      },
      error => {
        console.error('Error adding stock:', error);
      });
  }

  checkSelectedMedicine(medicine: IDrugDetails): number {
    if (this.medicineService.PharmacyStockList().some(m => m.drugId === medicine.drugID)) {
      return 1;
    }
    if (this.selectedMedicines.some(m => m.drugdetails.drugID === medicine.drugID)) {
      return 2;
    }
    return 0;
  }

}
