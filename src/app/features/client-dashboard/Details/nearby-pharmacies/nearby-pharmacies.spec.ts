import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyPharmacies } from './nearby-pharmacies';

describe('NearbyPharmacies', () => {
  let component: NearbyPharmacies;
  let fixture: ComponentFixture<NearbyPharmacies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyPharmacies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearbyPharmacies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
