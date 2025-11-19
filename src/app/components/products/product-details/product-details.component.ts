import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../state/products/service/product.service';
import { Store } from '@ngrx/store';
import { CartAction } from '../../../state/cart/store/cart.actions';
import { ToastService } from '../../../services/toast.service';
import { ProductsAction } from '../../../state/products/store/products.actions';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private store = inject(Store);
  private toast = inject(ToastService);

  product: any | null = null;
  loading = false;
  error: any = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.loading = true;
    this.productService.getProduct(id).subscribe(
      (p: any) => {
        this.product = p;
        this.loading = false;
      },
      (err) => {
        this.error = err;
        this.loading = false;
      },
    );
  }

  addToCart() {
    if (!this.product) return;
    this.store.dispatch(CartAction.addItem({ product: this.product, quantity: 1 }));
    this.store.dispatch(ProductsAction.adjustStock({ productId: this.product.id, delta: -1 }));
    try { this.toast.show(`${this.product.name} added to cart`); } catch { }
  }
}
