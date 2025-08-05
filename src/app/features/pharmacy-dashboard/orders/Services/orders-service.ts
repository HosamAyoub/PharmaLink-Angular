import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../Interfaces/iorder';
import { ConfigService } from '../../../../shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient, private configService: ConfigService){}

  getAllOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.configService.getApiUrl('orders/orders'));
  }

  markAsInReview(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/reviewing') + `/${orderId}`, {});
  }

  markAsPending(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/pending') + `/${orderId}`, {});
  }

  markAsOutForDelivery(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/outForDelivery') + `/${orderId}`, {});
  }

  markAsDelivered(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/delivered') + `/${orderId}`, {});
  }

  rejectOrder(orderId: number) {
    return this.http.post(this.configService.getApiUrl('orders/reject') + `/${orderId}`, {});
  }

}
