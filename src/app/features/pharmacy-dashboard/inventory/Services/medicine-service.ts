import { Injectable, signal } from '@angular/core';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../shared/services/config.service';
import { Observable } from 'rxjs';
import { IDrugDetails } from '../../../client-dashboard/Details/model/IDrugDetials';
import { IAddToStock } from './../Models/iadd-to-stock';
import { jwtDecode } from 'jwt-decode';
import { IPharmaProduct } from './../Models/ipharma-product';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  PharmacyStockList = signal<IPharmaProduct[]>([]);
  private accountId: number = 0;

  constructor(private http: HttpClient, private config: ConfigService) 
  {
    this.getUserDataFromToken();
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

  getPharmacyInventoryStatusByID(): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACYSTOCK_INVENTORY_STATUS_BY_ID}`);
    return this.http.get<any>(url);
  }

  SearchMedicines(searchTerm: string, pagenumber: number, pagesize: number): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACYSTOCK_SEARCH_ALL}`);
    return this.http.get<any>(url, {
      params: {
        q: searchTerm,
        pageNumber: pagenumber,
        pageSize: pagesize
      }
    });
  }

  getAllPharmacyMedicines(pagenumber: number, pagesize: number): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.BATCH_PHARMACY_STOCK_BY_ID}?`);
    return this.http.get<any>(url, {
      params: {
        pharmacyId: this.accountId,
        pageNumber: pagenumber,
        pageSize: pagesize
      }
    });
  }


  updatePharmacyStockList() {
    
    this.getAllPharmacyMedicines(1, 100).subscribe((res: any) => {
      this.PharmacyStockList.set(res.data.items);
    });
  }

  SearchForDrugs(searchTerm: string): Observable<IDrugDetails[]> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.DRUG_SEARCH}`);
    return this.http.get<IDrugDetails[]>(url, {
      params: {
        SearchAnything: searchTerm
      }
    });
  }

  EditPharmacyStockProduct(drugId: number, productPrice: number, quantity: number): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY_STOCK}`);
    return this.http.put<any>(url,
      {
        drugId: drugId,
        price: productPrice,
        quantityAvailable: quantity
      });
  }

  deletePharmacyStockProduct(drugId: number): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY_STOCK}/${drugId}`);
    return this.http.delete<any>(url);
  }


  AddPharmacyStockProduct(medicinesData: IAddToStock[]): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACY_STOCK}`);
    const mappedProducts =
    {
      products: medicinesData.map(medicine => ({
        drugId: medicine.drugdetails.drugID,
        quantityAvailable: medicine.quantity,
        price: medicine.price
      }))
    }
    return this.http.post<any>(url, mappedProducts);
  }

}
