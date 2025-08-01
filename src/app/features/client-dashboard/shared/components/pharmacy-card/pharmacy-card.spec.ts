import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyCard } from './pharmacy-card';

describe('PharmacyCard', () => {
  let component: PharmacyCard;
  let fixture: ComponentFixture<PharmacyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
