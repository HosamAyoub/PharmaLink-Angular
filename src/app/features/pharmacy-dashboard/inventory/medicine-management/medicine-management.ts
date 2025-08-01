import { Component } from '@angular/core';

@Component({
  selector: 'app-medicine-management',
  templateUrl: './medicine-management.html',
  styleUrls: ['./medicine-management.css']
})
export class MedicineManagement {
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
  }
}
