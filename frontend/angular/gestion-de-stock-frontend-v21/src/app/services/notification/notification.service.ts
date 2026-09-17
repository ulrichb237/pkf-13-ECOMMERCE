import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

/**
 * Service centralise de notifications (toasts) — meilleure pratique UX :
 * tout feedback utilisateur (succes, erreur actionnable, info) passe par ici.
 * Utilise un signal Angular (zoneless-friendly).
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {

  private readonly _toasts = signal<Toast[]>([]);
  private nextId = 0;

  readonly toasts = this._toasts.asReadonly();

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  dismiss(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  private push(type: ToastType, message: string): void {
    const toast: Toast = { id: ++this.nextId, type, message };
    this._toasts.update(list => [...list, toast]);
    // Auto-dismiss apres 5 s
    setTimeout(() => this.dismiss(toast.id), 5000);
  }
}
