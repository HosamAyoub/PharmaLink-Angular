import { TestBed } from '@angular/core/testing';

import { OrdersSignalrServiceService } from './orders-signalr-service.service';

describe('OrdersSignalrServiceService', () => {
  let service: OrdersSignalrServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersSignalrServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
