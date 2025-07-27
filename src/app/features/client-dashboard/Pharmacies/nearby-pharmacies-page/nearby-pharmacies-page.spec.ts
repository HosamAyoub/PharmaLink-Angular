import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyPharmaciesPage } from './nearby-pharmacies-page';

describe('NearbyPharmaciesPage', () => {
  let component: NearbyPharmaciesPage;
  let fixture: ComponentFixture<NearbyPharmaciesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyPharmaciesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearbyPharmaciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
