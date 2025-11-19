import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-toast-host',
  imports: [CommonModule],
  template: `
    <div class="toast-wrap" *ngIf="visible">
      <div class="toast">{{ message }}</div>
    </div>
  `,
  styles: [
    `
      .toast-wrap {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 1200;
      }
      .toast {
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(8, 30, 60, 0.2);
        font-weight: 600;
      }
    `,
  ],
})
export class ToastHostComponent implements OnInit, OnDestroy {
  message = '';
  visible = false;
  private sub?: Subscription;

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toast.stream.subscribe((m) => {
      this.message = m.text;
      this.visible = true;
      setTimeout(() => (this.visible = false), m.ttl ?? 3500);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
