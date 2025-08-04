import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../shared/services/config.service';
import { Observable } from 'rxjs';
import { IPharmaInventoryStatus } from '../Models/ipharma-inventory-status';
import { IPharmaProduct } from '../Models/ipharma-product';
import { Search } from './../../../client-dashboard/home/components/search/search';
import { IDrugDetails } from '../../../client-dashboard/Details/model/IDrugDetials';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;

  constructor(private http: HttpClient, private config: ConfigService) {}

  getPharmacyInventoryStatusByID(PharmacyID: number): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACYSTOCK_INVENTORY_STATUS_BY_ID}/?pharmacyId=${PharmacyID}`);
    return this.http.get<any>(url);
  }

  SearchMedicines(searchTerm: string , pharmacyid: number,pagenumber: number , pagesize: number): Observable<any> {
    const url = this.config.getApiUrl(`${this.ENDPOINTS.PHARMACYSTOCK_SEARCH_ALL}`);
    return this.http.get<any>(url , {
      params: {
        pharmacyId: pharmacyid,
        q: searchTerm,
        pageNumber: pagenumber,
        pageSize: pagesize
      }
    });
  }

  getAllPharmacyMedicines(pharmacyid: number,pagenumber: number , pagesize: number): Observable<any> {
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

}