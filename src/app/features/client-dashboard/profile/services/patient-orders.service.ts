import { inject, Injectable, signal } from '@angular/core';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { IPatientOrders } from '../../shared/models/ipatient-orders';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientOrdersService {
  http = inject(HttpClient);
  config = inject(ConfigService);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  patientOrders = signal<IPatientOrders[]>([]);

  loadPatientOrders(): void {
    this.http.get<IPatientOrders[]>(this.config.getApiUrl('orders/PatientOrders'))
      .subscribe({
        next: (orders) => {
          const sortedOrders = orders.sort((a, b) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
          this.patientOrders.set(sortedOrders);},
        error: (err) => console.error('Error fetching patient orders', err)
      });
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post<any>(this.config.getApiUrl(`orders/cancel/${orderId}`), {});
  }
}
