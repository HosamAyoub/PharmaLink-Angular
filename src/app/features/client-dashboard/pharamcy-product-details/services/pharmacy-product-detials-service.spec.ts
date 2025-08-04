import { TestBed } from '@angular/core/testing';

import { PharmacyProductDetialsService } from './pharmacy-product-detials-service';

describe('PharmacyProductDetialsService', () => {
  let service: PharmacyProductDetialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PharmacyProductDetialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
