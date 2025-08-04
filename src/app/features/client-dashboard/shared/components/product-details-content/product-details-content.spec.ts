import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsContent } from './product-details-content';

describe('ProductDetailsContent', () => {
  let component: ProductDetailsContent;
  let fixture: ComponentFixture<ProductDetailsContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
