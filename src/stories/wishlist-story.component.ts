import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-wishlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wl">
      <div class="cards">
        <div class="card" *ngFor="let p of items">
          <img class="thumb" [src]="p.image || '/assets/avif-test-image.avif'" />
          <div class="info">
            <div class="name">{{ p.name }}</div>
            <div class="price">{{ p.price | currency }}</div>
            <div class="actions">
              <button class="btn primary">Add to cart</button>
              <button class="btn ghost">Remove</button>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="!items || items.length === 0" class="empty">
        <div class="emoji">♡</div>
        <h3>No favorites yet</h3>
        <p>Add items you love and they will appear here.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 12px;
      }
      .card {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px;
        border: 1px solid #eee;
        border-radius: 8px;
        background: #fff;
      }
      .thumb {
        width: 84px;
        height: 84px;
        object-fit: cover;
        border-radius: 6px;
      }
      .info {
        display: flex;
        flex-direction: column;
      }
      .name {
        font-weight: 700;
      }
      .price {
        color: #1976d2;
      }
      .actions {
        margin-top: 8px;
        display: flex;
        gap: 8px;
      }
      .btn {
        padding: 8px 10px;
        border-radius: 8px;
        border: none;
      }
      .btn.ghost {
        background: transparent;
        border: 1px solid rgba(0, 0, 0, 0.06);
        color: #1976d2;
      }
      .empty {
        text-align: center;
        padding: 24px;
        border-radius: 8px;
        background: #fbfbfd;
        border: 1px dashed rgba(0, 0, 0, 0.04);
      }
      .emoji {
        font-size: 36px;
        color: #e91e63;
        margin-bottom: 8px;
      }
    `,
  ],
})
export class WishlistStoryComponent {
  @Input() items: any[] = [];
}
