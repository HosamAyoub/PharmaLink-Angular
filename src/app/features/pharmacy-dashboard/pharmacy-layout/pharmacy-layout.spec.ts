import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyLayout } from './pharmacy-layout';

describe('PharmacyLayout', () => {
  let component: PharmacyLayout;
  let fixture: ComponentFixture<PharmacyLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
