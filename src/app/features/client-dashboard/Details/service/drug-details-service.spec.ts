import { TestBed } from '@angular/core/testing';

import { DrugDetailsService } from './drug-details-service';

describe('DrugDetailsService', () => {
  let service: DrugDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrugDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
