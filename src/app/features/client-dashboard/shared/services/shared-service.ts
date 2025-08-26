import { inject, Injectable } from '@angular/core';
import { Config } from '@fortawesome/fontawesome-svg-core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient , private config:ConfigService) {

  }

  getDrugsAndPharmacies(searchTerm: string) {
    const apiUrl = this.config.getFullApiUrl(APP_CONSTANTS.API.ENDPOINTS.SHARED);
    return this.http.get(`${apiUrl}/searchByDrugOrPharmacy`, {
      params: { filter: searchTerm , size: 4 }
    });
  }

}
