import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { IPatientOrders } from '../../../client-dashboard/shared/models/ipatient-orders';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersServiceService {
  http = inject(HttpClient);
  config = inject(ConfigService);
  endPoint = APP_CONSTANTS.API.ENDPOINTS;
  AdminOrders = signal<IPatientOrders[]>([]);

  loadOrders(): void {
    this.http.get<IPatientOrders[]>(this.config.getApiUrl('orders/AdmintOrders'))
      .subscribe({
        next: (orders) => {
          const sortedOrders = orders.sort((a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );
          this.AdminOrders.set(sortedOrders);
        },
        error: (err) => console.error('Error fetching patient orders', err)
      });
  }
}
