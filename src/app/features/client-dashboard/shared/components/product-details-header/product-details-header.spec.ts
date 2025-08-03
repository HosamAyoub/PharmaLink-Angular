import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsHeader } from './product-details-header';

describe('ProductDetailsHeader', () => {
  let component: ProductDetailsHeader;
  let fixture: ComponentFixture<ProductDetailsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
