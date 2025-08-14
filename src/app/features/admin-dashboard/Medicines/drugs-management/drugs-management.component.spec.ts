import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsManagementComponent } from './drugs-management.component';

describe('DrugsManagementComponent', () => {
  let component: DrugsManagementComponent;
  let fixture: ComponentFixture<DrugsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
