import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-cart-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="summary">
      <div class="row">
        <span>Subtotal</span><span>{{ subtotal | number: '1.2-2' }} €</span>
      </div>
      <div class="row" *ngIf="discount > 0">
        <span>Discount</span><span>-{{ discount | number: '1.2-2' }} €</span>
      </div>
      <div class="row">
        <span>Tax</span><span>{{ tax | number: '1.2-2' }} €</span>
      </div>
      <div class="row">
        <span>Shipping</span><span>{{ shipping | number: '1.2-2' }} €</span>
      </div>
      <hr />
      <div class="row total">
        <span>Total</span><span>{{ total | number: '1.2-2' }} €</span>
      </div>
      <div class="actions"><button class="checkout">Proceed to checkout</button></div>
    </div>
  `,
  styles: [
    `
      .summary {
        width: 320px;
        padding: 12px;
        border: 1px solid #eee;
        border-radius: 8px;
        background: #fff;
      }
      .row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
      }
      .row.total {
        font-weight: 900;
        font-size: 1.05rem;
      }
      .actions {
        margin-top: 12px;
        text-align: right;
      }
      .checkout {
        background: #1976d2;
        color: #fff;
        padding: 8px 10px;
        border-radius: 8px;
        border: none;
      }
    `,
  ],
})
export class CartSummaryComponent {
  @Input() subtotal = 0;
  @Input() discount = 0;
  @Input() tax = 0;
  @Input() shipping = 0;

  get total() {
    return (this.subtotal || 0) - (this.discount || 0) + (this.tax || 0) + (this.shipping || 0);
  }
}
