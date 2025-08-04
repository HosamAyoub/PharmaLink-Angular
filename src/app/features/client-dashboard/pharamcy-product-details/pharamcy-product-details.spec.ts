import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharamcyProductDetails } from './pharamcy-product-details';

describe('PharamcyProductDetails', () => {
  let component: PharamcyProductDetails;
  let fixture: ComponentFixture<PharamcyProductDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharamcyProductDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharamcyProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
