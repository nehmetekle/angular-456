import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { WishlistToggle } from '../../../state/wishlist/store/wishlist.actions';
import { selectWishlistHas } from '../../../state/wishlist/store/wishlist.selectors';

@Component({
  standalone: true,
  selector: 'app-wishlist-button',
  imports: [CommonModule],
  template: `
    <button class="wish-btn" [class.filled]="inWishlist" (click)="toggle()">
      <span aria-hidden>❤</span>
    </button>
  `,
  styles: [
    `
      .wish-btn {
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 1.1rem;
      }
      .wish-btn.filled {
        color: #e91e63;
        transform: scale(1.1);
        transition: transform 0.18s ease;
      }
      .wish-btn:not(.filled) {
        color: #777;
      }
    `,
  ],
})
export class WishlistButtonComponent {
  @Input() product: any;
  private store = inject(Store);
  inWishlist = false;

  ngOnInit() {
    if (!this.product) return;
    this.store.select(selectWishlistHas(this.product.id)).subscribe((v) => (this.inWishlist = !!v));
  }

  toggle() {
    if (!this.product) return;
    this.store.dispatch(WishlistToggle({ product: this.product }));
  }
}
