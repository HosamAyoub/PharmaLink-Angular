import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedComponents } from './shared-components';

describe('SharedComponents', () => {
  let component: SharedComponents;
  let fixture: ComponentFixture<SharedComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
