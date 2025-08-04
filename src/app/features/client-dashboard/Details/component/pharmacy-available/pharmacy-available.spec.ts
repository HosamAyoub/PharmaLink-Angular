import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAvailable } from './pharmacy-available';

describe('PharmacyAvailable', () => {
  let component: PharmacyAvailable;
  let fixture: ComponentFixture<PharmacyAvailable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyAvailable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyAvailable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
