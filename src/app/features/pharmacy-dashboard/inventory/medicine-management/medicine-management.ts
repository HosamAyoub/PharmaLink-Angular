import { ChangeDetectorRef, Component, inject, ViewChild, ElementRef } from '@angular/core';
import { MedicineService } from './../Services/medicine-service';
import { IMedicine } from './../Models/imedicine';
import { IPharmaInventoryStatus } from '../Models/ipharma-inventory-status';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductStatus } from '../../../../shared/enums/product-status-enum';
import * as XLSX from 'xlsx';

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
  @ViewChild('filterSelect') filterselect!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Excel upload properties
  isUploading = false;
  uploadProgress = 0;
  uploadMessage = '';
  showUploadMessage = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // load inventory stats
    this.getPharmacyStatus();
    // load all medicines
    this.loadMedicines('');
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
    if (query === '') {
      this.medicineService.getAllPharmacyMedicines().subscribe((res: any) => {
        this.Result = res.data.map((item: any) => ({
          pharmaproduct: item,
          isediting: false as boolean,
        }));
        this.onFilterChange(this.filterselect.nativeElement.value);
      },
        error => {
          console.error('Error loading all medicines:', error);
        });
    }
    else {
      this.medicineService.SearchMedicines(query, pageNumber, pageSize).subscribe((res: any) => {
        this.Result = res.data.map((item: any) => ({
          pharmaproduct: item,
          isediting: false as boolean,
        }));
        this.onFilterChange(this.filterselect.nativeElement.value);
      },
        (error: any) => {
          this.Result = [];
          this.onFilterChange(this.filterselect.nativeElement.value);
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
    this.cd.detectChanges();
  }

  updateMedicine(medicine: IMedicine) {
    const updatedQuantity = parseInt((document.getElementById(`quantity-${medicine.pharmaproduct.drugId}`) as HTMLInputElement).value);
    const updatedPrice = parseFloat((document.getElementById(`price-${medicine.pharmaproduct.drugId}`) as HTMLInputElement).value);
    const updatedStatus = (document.getElementById(`toggle-${medicine.pharmaproduct.drugId}`) as HTMLInputElement).checked ? ProductStatus.Available : ProductStatus.NotAvailable;
    this.medicineService.EditPharmacyStockProduct(medicine.pharmaproduct.drugId, updatedPrice, updatedQuantity, updatedStatus)
      .subscribe(() => {
        medicine.pharmaproduct.quantityAvailable = updatedQuantity;
        medicine.pharmaproduct.price = updatedPrice;
        medicine.pharmaproduct.status = updatedQuantity > 0 ? updatedStatus : ProductStatus.NotAvailable;
        medicine.isediting = false;
        this.getPharmacyStatus();
      });
    (document.getElementById(`toggle-${medicine.pharmaproduct.drugId}`) as HTMLInputElement).checked = medicine.pharmaproduct.status === ProductStatus.Available;

  }

  toggleMedicineStatus(medicine: IMedicine) {
    if (medicine.pharmaproduct.status == ProductStatus.Available && medicine.pharmaproduct.quantityAvailable > 0) {
      this.changeMedicineStatus(medicine, ProductStatus.NotAvailable);
    }
    if (medicine.pharmaproduct.status == ProductStatus.NotAvailable && medicine.pharmaproduct.quantityAvailable === 0) {
      medicine.isediting = true;
      medicine.pharmaproduct.status = medicine.pharmaproduct.quantityAvailable > 0 ?
        ProductStatus.Available : ProductStatus.NotAvailable;
    }
    if (medicine.pharmaproduct.status == ProductStatus.NotAvailable && medicine.pharmaproduct.quantityAvailable > 0) {
      this.changeMedicineStatus(medicine, ProductStatus.Available);
    }

  }


  changeMedicineStatus(medicine: IMedicine, status: ProductStatus) {
    this.medicineService.EditPharmacyStockProduct(medicine.pharmaproduct.drugId, medicine.pharmaproduct.price, medicine.pharmaproduct.quantityAvailable, status)
      .subscribe(() => {
        medicine.pharmaproduct.status = status;
        this.getPharmacyStatus();
      });
  }

  deleteMedicine(medicine: IMedicine) {
    this.medicineService.deletePharmacyStockProduct(medicine.pharmaproduct.drugId)
      .subscribe(() => {
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

  // Excel Upload Methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processExcelFile(file);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  processExcelFile(file: File) {
    this.isUploading = true;
    this.uploadProgress = 0;
    this.showUploadMessage = false;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        this.validateAndProcessExcelData(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        this.showMessage('Error reading Excel file. Please check the file format.', 'error');
        this.isUploading = false;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  validateAndProcessExcelData(data: any[]) {
    // Skip header and instruction rows, filter out empty rows
    const rows = data.slice(2).filter(row => row && row.length > 0 && row[0] !== 'INSTRUCTIONS:');

    if (rows.length === 0) {
      this.showMessage('No data found in Excel file.', 'error');
      this.isUploading = false;
      return;
    }

    // Expected columns: DrugId, DrugName, Category, ActiveIngredient, Price, Quantity, Status
    // We only need: DrugId (0), Price (4), Quantity (5), Status (6)
    const validRows = rows.filter(row => {
      return row[0] && // DrugId
        row[4] !== undefined && // Price (column 4)
        row[5] !== undefined && // Quantity (column 5)
        (row[6] === 0 || row[6] === 1 || row[6] === '0' || row[6] === '1'); // Status (column 6)
    });

    if (validRows.length === 0) {
      this.showMessage('No valid data found. Please ensure DrugId, Price, Quantity, and Status columns have valid values.', 'error');
      this.isUploading = false;
      return;
    }

    this.processBulkUpdate(validRows);
  }

  async processBulkUpdate(rows: any[]) {
    const totalRows = rows.length;
    let processedRows = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const row of rows) {
      try {
        const drugId = row[0];           // DrugId (column 0)
        const price = parseFloat(row[4]); // Price (column 4)
        const quantity = parseInt(row[5]); // Quantity (column 5)
        const status = parseInt(row[6]) === 1 ? ProductStatus.Available : ProductStatus.NotAvailable; // Status (column 6)

        // Find the medicine in current list
        const medicine = this.Result.find(m => m.pharmaproduct.drugId === drugId);

        if (medicine) {
          await this.updateMedicineFromExcel(medicine, price, quantity, status);
          successCount++;
        } else {
          console.warn(`Medicine with ID ${drugId} not found in current inventory`);
          errorCount++;
        }
      } catch (error) {
        console.error('Error updating medicine:', error);
        errorCount++;
      }

      processedRows++;
      this.uploadProgress = Math.round((processedRows / totalRows) * 100);
      this.cd.detectChanges();

      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.completeUpload(successCount, errorCount);
  }

  updateMedicineFromExcel(medicine: IMedicine, price: number, quantity: number, status: ProductStatus): Promise<void> {
    return new Promise((resolve, reject) => {
      const finalStatus = quantity > 0 ? status : ProductStatus.NotAvailable;

      this.medicineService.EditPharmacyStockProduct(medicine.pharmaproduct.drugId, price, quantity, finalStatus)
        .subscribe({
          next: () => {
            // Update local data
            medicine.pharmaproduct.price = price;
            medicine.pharmaproduct.quantityAvailable = quantity;
            medicine.pharmaproduct.status = finalStatus;
            resolve();
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  completeUpload(successCount: number, errorCount: number) {
    this.isUploading = false;
    this.uploadProgress = 100;

    let message = `Upload completed! ${successCount} medicines updated successfully.`;
    if (errorCount > 0) {
      message += ` ${errorCount} failed to update.`;
    }

    this.showMessage(message, successCount > 0 ? 'success' : 'error');

    // Refresh the data
    this.getPharmacyStatus();
    this.loadMedicines('');

    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.uploadMessage = message;
    this.showUploadMessage = true;

    // Auto hide message after 5 seconds
    setTimeout(() => {
      this.showUploadMessage = false;
      this.cd.detectChanges();
    }, 5000);
  }

  downloadTemplate() {
    // Create Excel file with current pharmacy medicines
    const headerRow = ['DrugId', 'DrugName', 'Category', 'ActiveIngredient', 'Price', 'Quantity', 'Status'];

    // Prepare data rows from current medicines
    const dataRows = this.Result.map(medicine => [
      medicine.pharmaproduct.drugId,
      medicine.pharmaproduct.drugName,
      medicine.pharmaproduct.drugCategory,
      medicine.pharmaproduct.drugActiveIngredient,
      medicine.pharmaproduct.price,
      medicine.pharmaproduct.quantityAvailable,
      medicine.pharmaproduct.status === ProductStatus.Available ? 1 : 0
    ]);

    // Add instructions row
    const instructionRow = [
      'INSTRUCTIONS:',
      'Only modify Price, Quantity,',
      'and Status columns.',
      'Status: 1=Available, 0=Not Available',
      'Do not modify other columns!',
      '',
      ''
    ];

    // Combine all data
    const worksheetData = [
      headerRow,
      instructionRow,
      ...dataRows
    ];

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 10 }, // DrugId
      { wch: 25 }, // DrugName
      { wch: 15 }, // Category
      { wch: 20 }, // ActiveIngredient
      { wch: 10 }, // Price
      { wch: 10 }, // Quantity
      { wch: 10 }  // Status
    ];

    // Style the header row (make it bold and colored)
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1:G1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '366092' } },
        alignment: { horizontal: 'center' }
      };
    }

    // Style the instruction row
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { italic: true, color: { rgb: 'FF0000' } },
        fill: { fgColor: { rgb: 'FFF2CC' } }
      };
    }

    // Protect certain columns (make them read-only appearance)
    // Note: This is visual styling, actual protection requires Excel features
    for (let row = 2; row < worksheetData.length; row++) {
      for (let col = 0; col < 4; col++) { // Protect first 4 columns
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          fill: { fgColor: { rgb: 'F2F2F2' } },
          font: { color: { rgb: '666666' } }
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pharmacy Medicines');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `pharmacy_medicines_${currentDate}.xlsx`;

    XLSX.writeFile(wb, filename);

    // Show success message
    this.showMessage(`Template downloaded with ${this.Result.length} medicines. Update Price, Quantity, and Status columns only!`, 'success');
  }
}
