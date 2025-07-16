import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySection } from './pharmacy-section';

describe('PharmacySection', () => {
  let component: PharmacySection;
  let fixture: ComponentFixture<PharmacySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacySection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacySection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
