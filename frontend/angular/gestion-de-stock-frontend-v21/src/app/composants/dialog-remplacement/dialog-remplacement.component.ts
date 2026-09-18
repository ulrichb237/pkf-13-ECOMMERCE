import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

/** Ligne generique pour le dialog de remplacement (client, fournisseur, article) */
export interface OptionRemplacement {
  id?: number;
  label: string;
  sousTitre?: string;
}

/**
 * Dialog de remplacement : choisit un nouvel element parmi une liste chargee
 * par la page et confirme. Utilise pour :
 * - PATCH /commandes-clients/{id}/client/{idClient}      (reaffectation client)
 * - PATCH /commandes-fournisseurs/{id}/fournisseur/{idF} (reaffectation fournisseur)
 * - PATCH /commandes-clients|fournisseurs/{id}/lignes/{idLigne}/article/{idArticle}
 */
@Component({
  selector: 'app-dialog-remplacement',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-backdrop" (click)="annuler()">
      <div class="dialog" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
        <h3 class="dialog-title">{{ titre() }}</h3>
        @if (resumeActuel()) {
          <p class="text-muted">{{ resumeActuel() }}</p>
        }

        @if (chargement()) {
          <div class="empty-state empty-state-sm">Chargement…</div>
        } @else if (!options().length) {
          <div class="empty-state empty-state-sm">Aucun element disponible</div>
        } @else {
          <div class="list-remplacement" role="listbox" aria-label="{{ titre() }}">
            @for (opt of options(); track opt.id) {
              <button type="button"
                      class="opt-remplacement"
                      role="option"
                      [class.opt-active]="optionSelectionnee()?.id === opt.id"
                      (click)="optionSelectionnee.set(opt)">
                <span>{{ opt.label }}</span>
                @if (opt.sousTitre) {
                  <span class="text-muted tnum">{{ opt.sousTitre }}</span>
                }
              </button>
            }
          </div>
        }

        <div class="dialog-actions">
          <button type="button" class="btn-pill btn-pill-secondary" (click)="annuler()">Annuler</button>
          <button type="button" class="btn-pill btn-pill-primary"
                  [disabled]="!optionSelectionnee() || operationEnCours()"
                  (click)="confirmer()">
            {{ operationEnCours() ? 'En cours…' : 'Remplacer' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list-remplacement { max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: var(--sp-xs); }
    .opt-remplacement {
      display: flex; justify-content: space-between; align-items: center; gap: var(--sp-sm);
      padding: var(--sp-sm); border: 1px solid var(--clr-hairline); border-radius: 8px;
      background: var(--clr-canvas); cursor: pointer; text-align: left; font: inherit;
    }
    .opt-remplacement:hover { border-color: var(--clr-primary-subdued); }
    .opt-active { border-color: var(--clr-primary); box-shadow: 0 0 0 1px var(--clr-primary); }
  `]
})
export class DialogRemplacementComponent {

  titre = input.required<string>();
  options = input<Array<OptionRemplacement>>([]);
  chargement = input(false);
  operationEnCours = input(false);
  /** Valeur actuellement en place (affichee comme contexte) */
  valeurActuelle = input<string>('');

  remplacementConfirme = output<OptionRemplacement>();
  ferme = output<void>();

  readonly optionSelectionnee = signal<OptionRemplacement | null>(null);
  readonly resumeActuel = computed(() => this.valeurActuelle() ? `Actuel : ${this.valeurActuelle()}` : '');

  confirmer(): void {
    const opt = this.optionSelectionnee();
    if (opt) {
      this.remplacementConfirme.emit(opt);
    }
  }

  annuler(): void {
    this.ferme.emit();
  }
}
