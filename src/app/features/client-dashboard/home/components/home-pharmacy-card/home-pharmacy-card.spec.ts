import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePharmacyCard } from './home-pharmacy-card';

describe('HomePharmacyCard', () => {
  let component: HomePharmacyCard;
  let fixture: ComponentFixture<HomePharmacyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePharmacyCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePharmacyCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
