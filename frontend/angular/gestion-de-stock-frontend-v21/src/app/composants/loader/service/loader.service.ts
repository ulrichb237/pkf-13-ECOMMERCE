import { Injectable, signal } from '@angular/core';

/**
 * Etat global du loader, base sur un signal (zoneless-friendly).
 * L'intercepteur HTTP appelle show()/hide() ; le LoaderComponent lit visible().
 *
 * Perf UX :
 * - delai de 200 ms avant affichage : les reponses rapides ne font pas
 *   clignoter le loader (tempete visuelle pendant les rafales de requetes) ;
 * - compteur de requetes : le loader reste affiche tant que la derniere
 *   requete d'une rafale n'est pas terminee.
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private static readonly DELAI_AFFICHAGE_MS = 200;

  private readonly _visible = signal(false);
  readonly visible = this._visible.asReadonly();

  private requetesEnCours = 0;
  private timerAffichage: ReturnType<typeof setTimeout> | null = null;

  show(): void {
    this.requetesEnCours++;
    if (this.timerAffichage === null) {
      this.timerAffichage = setTimeout(() => {
        this.timerAffichage = null;
        if (this.requetesEnCours > 0) {
          this._visible.set(true);
        }
      }, LoaderService.DELAI_AFFICHAGE_MS);
    }
  }

  hide(): void {
    this.requetesEnCours = Math.max(0, this.requetesEnCours - 1);
    if (this.requetesEnCours === 0) {
      if (this.timerAffichage !== null) {
        clearTimeout(this.timerAffichage);
        this.timerAffichage = null;
      }
      this._visible.set(false);
    }
  }
}
