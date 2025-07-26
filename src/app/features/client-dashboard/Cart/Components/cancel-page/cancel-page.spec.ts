import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPage } from './cancel-page';

describe('CancelPage', () => {
  let component: CancelPage;
  let fixture: ComponentFixture<CancelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
