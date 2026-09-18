import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Barre de recherche par code (commandes clients/fournisseurs, categories).
 * Emits : le code saisi ; une chaine vide = annulation du filtre.
 */
@Component({
  selector: 'app-recherche-cmd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="recherche-cmd">
      <input type="text" class="form-control" [placeholder]="placeholder()"
             aria-label="Rechercher par code" [(ngModel)]="codeRecherche" (keyup.enter)="lancerRecherche()">
      <button type="button" class="btn btn-secondary" (click)="lancerRecherche()">Chercher</button>
      @if (codeRecherche()) {
        <button type="button" class="btn-link" (click)="annulerRecherche()">Annuler</button>
      }
    </div>
  `,
  styles: [`
    .recherche-cmd { display: flex; gap: var(--sp-sm); align-items: center; margin-bottom: var(--sp-md); }
    .recherche-cmd input { max-width: 320px; }
  `]
})
export class RechercheCmdComponent {

  placeholder = input('Rechercher par code');

  readonly codeRecherche = signal('');
  readonly rechercheDemandee = output<string>();

  lancerRecherche(): void {
    const code = this.codeRecherche().trim();
    if (code) {
      this.rechercheDemandee.emit(code);
    }
  }

  annulerRecherche(): void {
    this.codeRecherche.set('');
    this.rechercheDemandee.emit('');
  }
}
