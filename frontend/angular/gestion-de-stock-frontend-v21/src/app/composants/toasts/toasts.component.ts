import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { NotificationService } from '../../services/notification/notification.service';

/**
 * Conteneur global des toasts, rendu une seule fois dans le shell
 * (page-dashboard). Les erreurs 400 du backend (ex. *_ALREADY_IN_USE)
 * y sont affichees comme messages actionnables.
 */
@Component({
  imports: [NgFor, NgClass],
  selector: 'app-toasts',
  template: `
    <div class="toasts" aria-live="polite">
      <div *ngFor="let toast of notificationService.toasts()"
           class="toast-item"
           [ngClass]="'toast-' + toast.type"
           role="status">
        <span class="toast-message">{{ toast.message }}</span>
        <button type="button" class="toast-close" (click)="notificationService.dismiss(toast.id)"
                aria-label="Fermer">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toasts {
      position: fixed;
      top: var(--sp-lg);
      right: var(--sp-lg);
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: var(--sp-sm);
      max-width: 380px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-md);
      padding: var(--sp-md) var(--sp-lg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-2);
      font-size: 14px;
      background: var(--clr-canvas);
      border: 1px solid var(--clr-hairline);
    }
    .toast-success { border-left: 4px solid var(--clr-success); }
    .toast-error { border-left: 4px solid var(--clr-ruby); }
    .toast-info { border-left: 4px solid var(--clr-primary); }
    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      color: var(--clr-ink-mute);
    }
  `]
})
export class ToastsComponent {

  constructor(public notificationService: NotificationService) { }

}
