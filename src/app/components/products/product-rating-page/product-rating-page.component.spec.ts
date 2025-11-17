import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingPageComponent } from './product-rating-page.component';

describe('ProductRatingPageComponent', () => {
  let component: ProductRatingPageComponent;
  let fixture: ComponentFixture<ProductRatingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRatingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRatingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
