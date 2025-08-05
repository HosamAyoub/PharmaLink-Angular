import { TestBed } from '@angular/core/testing';

import { PharmacyAnalysisService } from './pharmacy-analysis-service';

describe('PharmacyAnalysisService', () => {
  let service: PharmacyAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PharmacyAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
