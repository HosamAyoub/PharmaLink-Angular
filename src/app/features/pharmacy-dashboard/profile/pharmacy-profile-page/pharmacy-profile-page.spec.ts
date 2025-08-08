import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyProfilePage } from './pharmacy-profile-page';

describe('PharmacyProfilePage', () => {
  let component: PharmacyProfilePage;
  let fixture: ComponentFixture<PharmacyProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyProfilePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
