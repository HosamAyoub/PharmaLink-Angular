import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicineDetailsComponent } from './add-medicine-details-component';

describe('AddMedicineDetailsComponent', () => {
  let component: AddMedicineDetailsComponent;
  let fixture: ComponentFixture<AddMedicineDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicineDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
