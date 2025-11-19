import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectWishlistItems } from '../../../state/wishlist/store/wishlist.selectors';
import { WishlistRemove } from '../../../state/wishlist/store/wishlist.actions';
import { CartAction } from '../../../state/cart/store/cart.actions';
import { ToastService } from '../../../services/toast.service';
@Component({
  standalone: true,
  selector: 'app-wishlist-page',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wishlist-page">
      <div class="page-header">
        <h2>Your Favorites</h2>
        <div class="meta" *ngIf="items$ | async as items">{{ (items?.length || 0) }} items</div>
      </div>

      <div *ngIf="items$ | async as items">
        <div *ngIf="items.length > 0; else emptyState">
          <div class="cards">
            <div class="card" *ngFor="let p of items">
              <div class="thumb"><img [src]="p.image || '/assets/avif-test-image.avif'" /></div>
              <div class="info">
                <div class="name">{{ p.name }}</div>
                <div class="price">{{ p.price | currency }}</div>
                <div class="actions">
                  <button (click)="addToCart(p)" class="btn primary">Add to cart</button>
                  <button (click)="remove(p.id)" class="btn ghost">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ng-template #emptyState>
          <div class="empty">
            <div class="emoji">♡</div>
            <h3>No favorites yet</h3>
            <p>Add items you love and they will appear here.</p>
            <a routerLink="/app/shop/products" class="btn primary">Browse products</a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
    .wishlist-page { padding: 8px 4px }
    .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px }
    .meta { color:#64748b }
    .cards { display:grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap:12px }
    .card { display:flex; gap:12px; align-items:center; padding:12px; border-radius:8px; background:#fff; border:1px solid rgba(10,10,10,0.04) }
    .thumb img { width:84px; height:84px; object-fit:cover; border-radius:6px }
    .info { display:flex; flex-direction:column; gap:6px }
    .name { font-weight:700 }
    .price { color:#1976d2 }
    .actions { margin-top:6px; display:flex; gap:8px }
    .btn { padding:8px 10px; border-radius:8px; border:none; cursor:pointer }
    .btn.primary { background:#1976d2; color:#fff }
    .btn.ghost { background:transparent; color:#1976d2; border:1px solid rgba(25,118,210,0.12) }
    .empty { text-align:center; padding:36px; border-radius:10px; border:1px dashed rgba(0,0,0,0.06); background:#fbfbfd }
    .empty .emoji { font-size:40px; color:#e91e63; margin-bottom:12px }
    `,
  ],
})
export class WishlistPageComponent {
  private store = inject(Store);
  private toast = inject(ToastService);
  items$ = this.store.select(selectWishlistItems);

  remove(id: number) {
    this.store.dispatch(WishlistRemove({ productId: id }));
    this.toast.show('Removed from wishlist');
  }

  addToCart(p: any) {
    this.store.dispatch(CartAction.addItem({ product: p, quantity: 1 }));
    this.store.dispatch(WishlistRemove({ productId: p.id }));
    this.toast.show('Added to cart');
  }
}
