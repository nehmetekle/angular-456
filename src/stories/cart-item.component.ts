import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sb-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item">
      <img
        class="thumb"
        [src]="product?.image || '/assets/avif-test-image.avif'"
        alt="{{ product?.name }}"
      />
      <div class="meta">
        <div class="title">{{ product?.name }}</div>
        <div class="price">{{ product?.price | currency }}</div>
      </div>
      <div class="qty">
        <input
          type="number"
          min="1"
          [value]="quantity"
          (change)="onQuantityChange(+$any($event.target).value)"
        />
      </div>
      <div class="line">{{ (product?.price || 0) * quantity | number: '1.2-2' }} €</div>
      <button class="remove" (click)="$emitRemove()">Remove</button>
    </div>
  `,
  styles: [
    `
      .cart-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #eee;
      }
      .thumb {
        width: 56px;
        height: 56px;
        object-fit: cover;
        border-radius: 6px;
      }
      .meta {
        flex: 1;
      }
      .title {
        font-weight: 700;
      }
      .price {
        color: #1976d2;
      }
      .qty input {
        width: 60px;
      }
      .line {
        font-weight: 800;
      }
      .remove {
        background: transparent;
        border: 1px solid rgba(0, 0, 0, 0.06);
        padding: 6px 8px;
        border-radius: 6px;
      }
    `,
  ],
})
export class CartItemComponent {
  @Input() product: any = { id: 1, name: 'Sample', price: 19.9 };
  @Input() quantity = 1;
  @Output() remove = new EventEmitter<void>();
  @Output() quantityChange = new EventEmitter<number>();

  onQuantityChange(q: number) {
    this.quantity = Math.max(1, q || 1);
    this.quantityChange.emit(this.quantity);
  }

  $emitRemove() {
    this.remove.emit();
  }
}
