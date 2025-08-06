import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../shared/services/config.service';
import { Observable } from 'rxjs';
import { IDrugDetails } from '../../../client-dashboard/Details/model/IDrugDetials';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  constructor(private http: HttpClient, private config: ConfigService) {
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

  getAllPharmacyMedicines(pharmacyid: number, pagenumber: number, pagesize: number): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.BATCH_PHARMACY_STOCK_BY_ID}?`);
    return this.http.get<any>(url, {
      params: {
        pharmacyId: pharmacyid,
        pageNumber: pagenumber,
        pageSize: pagesize
      }
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

}