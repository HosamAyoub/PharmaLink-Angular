import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicinesComponent } from './add-medicines-component';

describe('AddMedicinesComponent', () => {
  let component: AddMedicinesComponent;
  let fixture: ComponentFixture<AddMedicinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
