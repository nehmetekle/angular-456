import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-product-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pd">
      <div class="image"><img [src]="product?.image || '/assets/avif-test-image.avif'" /></div>
      <div class="info">
        <h3>{{ product?.name }}</h3>
        <p class="desc">{{ product?.description }}</p>
        <div class="price">{{ product?.price | number: '1.2-2' }} €</div>
        <div class="actions">
          <button class="add">Add to cart</button><button class="wish">♡</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .pd {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        border: 1px solid #eee;
        padding: 12px;
        border-radius: 8px;
      }
      .image img {
        width: 220px;
        height: 160px;
        object-fit: cover;
        border-radius: 8px;
      }
      .info h3 {
        margin: 0 0 6px 0;
      }
      .desc {
        color: #64748b;
        margin: 0 0 8px 0;
      }
      .price {
        font-weight: 900;
        color: #1976d2;
        margin-bottom: 8px;
      }
      .actions button {
        margin-right: 8px;
        padding: 8px 10px;
        border-radius: 8px;
      }
      .actions .add {
        background: #1976d2;
        color: #fff;
        border: none;
      }
      .actions .wish {
        background: transparent;
        border: 1px solid rgba(0, 0, 0, 0.06);
      }
    `,
  ],
})
export class ProductDetailsStoryComponent {
  @Input() product: any = { id: 1, name: 'Sample Item', description: 'Nice item', price: 39.9 };
}
