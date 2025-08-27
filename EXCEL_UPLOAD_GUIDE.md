# Excel Bulk Update Feature - Medicine Management

## Overview
The Medicine Management component now supports bulk updating of medicines via Excel file upload. The "Template" button downloads all your current pharmacy medicines in Excel format, which you can then modify and upload back to update multiple medicines at once.

## How to Use

### 1. Download Current Medicine Data
- Click the "Template" button in the Medicine Management page
- This downloads an Excel file with ALL your current pharmacy medicines
- The file includes: DrugId, DrugName, Category, ActiveIngredient, Price, Quantity, Status
- Filename format: `pharmacy_medicines_YYYY-MM-DD.xlsx`

### 2. Edit Your Excel File
**IMPORTANT**: Only modify these columns:
- **Price** (Column E): Update medicine prices
- **Quantity** (Column F): Update stock quantities  
- **Status** (Column G): Set availability (1=Available, 0=Not Available)

**DO NOT MODIFY**: DrugId, DrugName, Category, or ActiveIngredient columns (they are for reference only)

### 3. Excel File Format
| DrugId | DrugName | Category | ActiveIngredient | Price | Quantity | Status |
|--------|----------|----------|------------------|-------|----------|--------|
| 123 | Aspirin | Pain Relief | Acetylsalicylic Acid | 25.50 | 100 | 1 |
| 456 | Paracetamol | Pain Relief | Paracetamol | 15.75 | 50 | 1 |
| 789 | Ibuprofen | Anti-inflammatory | Ibuprofen | 30.00 | 0 | 0 |

### 4. Upload Process
1. Click the "Bulk Update" button
2. Select your modified Excel file (.xlsx or .xls)
3. The system will process each medicine automatically
4. A progress bar shows the upload status
5. Success/error messages are displayed

### 5. Important Notes
- Only medicines that exist in your current inventory will be updated
- If quantity is set to 0, the status will automatically be set to "Not Available"
- The system processes one medicine at a time to prevent server overload
- After completion, the medicine list is automatically refreshed
- The Excel file includes visual styling to highlight editable vs read-only columns

### 6. Error Handling
- Invalid DrugIds are skipped with warnings
- Malformed data rows are ignored
- A summary shows successful and failed updates
- Error messages help identify issues

### 7. Visual Cues in Excel
- **Header row**: Blue background with white text
- **Instruction row**: Yellow background with red text
- **Read-only columns**: Gray background (DrugId, DrugName, Category, ActiveIngredient)
- **Editable columns**: White background (Price, Quantity, Status)

## Workflow Example
1. **Download**: Click "Template" → Get `pharmacy_medicines_2025-08-27.xlsx`
2. **Edit**: Open file → Modify prices, quantities, and availability status
3. **Upload**: Click "Bulk Update" → Select modified file → Wait for completion
4. **Result**: View updated medicines in the table with refreshed inventory stats

## Technical Details
- Supports .xlsx and .xls file formats
- Maximum file size depends on browser limitations
- Uses XLSX library with advanced formatting
- Async processing prevents UI blocking
- Auto-refresh of inventory statistics after upload
- Column width optimization for better readability
