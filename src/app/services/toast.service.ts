import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messages = new Subject<{ text: string; ttl?: number }>();

  get stream(): Observable<{ text: string; ttl?: number }> {
    return this.messages.asObservable();
  }

  show(text: string, ttl = 3500) {
    try {
      this.messages.next({ text, ttl });
    } catch (e) {
      // ignore
    }
  }
}
