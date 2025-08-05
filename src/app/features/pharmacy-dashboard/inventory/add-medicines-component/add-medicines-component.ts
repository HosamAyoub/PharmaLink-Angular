// add-medicines.component.ts
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AddMedicineDetailsComponent } from '../add-medicine-details-component/add-medicine-details-component';
import { RouterLink } from '@angular/router';
import { MedicineService } from '../Services/medicine-service';
import { IDrugDetails } from '../../../client-dashboard/Details/model/IDrugDetials';
import { DrugService } from '../../../client-dashboard/Categories_Page/service/drug-service';

interface Medicine {
  id: string;
  name: string;
  activeIngredient: string;
  description: string;
  category: string;
  selected?: boolean;
}

@Component({
  selector: 'app-add-medicines',
  imports: [RouterLink],
templateUrl: './add-medicines-component.html',
  styleUrls: ['./add-medicines-component.css']
})
export class AddMedicinesComponent implements OnInit {
  searchQuery: string = '';
  selectedMedicines: IDrugDetails[] = [];
  filteredMedicines: IDrugDetails[] = [];
  medicineService: MedicineService = inject(MedicineService);
  drugservice: DrugService = inject(DrugService);


  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() 
  {
    this.onSearchChange("Antibiotic");
  }

  onSearchChange(query: string) 
  {
    if(query === '') 
    {
      this.filteredMedicines = [];
    }
    else
    {
       this.medicineService.SearchForDrugs(query).subscribe(results =>
        { 
          this.filteredMedicines = results;
          this.cd.detectChanges();
        }, (error: any) => {
          this.filteredMedicines = [];
        });
    }
   
  }

  onMedicineClick(medicine: IDrugDetails) 
  {
    if (this.selectedMedicines.some(m => m.drugID === medicine.drugID)) {
      this.selectedMedicines = this.selectedMedicines.filter(m => m.drugID !== medicine.drugID);
    }
    else
    {
      this.selectedMedicines.push(medicine);
    }
   
  }

  onMedicineSelect(medicine: IDrugDetails) 
  {
    if (this.selectedMedicines.some(m => m.drugID === medicine.drugID)) {
      this.selectedMedicines.push(medicine);
    } else {
      this.selectedMedicines = this.selectedMedicines.filter(m => m.drugID !== medicine.drugID);
    }
  }

  removeMedicine(medicine: IDrugDetails) 
  {
    this.selectedMedicines = this.selectedMedicines.filter(m => m.drugID !== medicine.drugID);
  }


  onAddToStock(medicineData: any) 
  {
    console.log('Adding to stock:', medicineData);
    this.selectedMedicines = [];
  }

  checkSelectedMedicine(medicine: IDrugDetails): boolean 
  {
    return this.selectedMedicines.some(m => m.drugID === medicine.drugID);
  }

  

  

}