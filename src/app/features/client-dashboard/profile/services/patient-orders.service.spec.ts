import { TestBed } from '@angular/core/testing';

import { PatientOrdersService } from './patient-orders.service';

describe('PatientOrdersService', () => {
  let service: PatientOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
