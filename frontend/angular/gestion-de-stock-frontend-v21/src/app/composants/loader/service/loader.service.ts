import { Injectable, signal } from '@angular/core';

/**
 * Etat global du loader, base sur un signal (zoneless-friendly).
 * L'intercepteur HTTP appelle show()/hide() ; le LoaderComponent lit visible().
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private readonly _visible = signal(false);
  readonly visible = this._visible.asReadonly();

  show(): void {
    this._visible.set(true);
  }

  hide(): void {
    this._visible.set(false);
  }
}
