import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { EntrepriseService } from '../../../services/entreprise/entreprise.service';
import { EntrepriseDto } from '../../../../gs-api/src/models/entreprise-dto';

/**
 * Fiche entreprise : GET /api/v1/entreprises/{idEntreprise}
 * L'identifiant vient de l'utilisateur connecte (multi-entreprise) : chaque
 * utilisateur ne voit que sa propre entreprise, la page ne liste jamais
 * les autres (GET /entreprises sans filtre n'est pas expose dans le menu).
 */
@Component({
  imports: [NgIf],
  selector: 'app-page-entreprise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Mon entreprise</h1>
      </div>

      <div class="alert alert-danger" *ngIf="errorMsg()">{{ errorMsg() }}</div>

      <div class="empty-state" *ngIf="chargement()">Chargement…</div>

      @if (entreprise(); as ent) {
        <div class="card custom-border entreprise-card">
          <h2 class="entreprise-nom">{{ ent.nom }}</h2>
          @if (ent.description) {
            <p class="text-muted">{{ ent.description }}</p>
          }

          <ul class="list-group">
            <li class="list-group-item"><strong>Code fiscal :</strong> <span class="tnum">{{ ent.codeFiscal || '—' }}</span></li>
            <li class="list-group-item"><strong>E-mail :</strong> {{ ent.email || '—' }}</li>
            <li class="list-group-item"><strong>Telephone :</strong> <span class="tnum">{{ ent.numTel || '—' }}</span></li>
            <li class="list-group-item"><strong>Site web :</strong> {{ ent.steWeb || '—' }}</li>
          </ul>

          @if (ent.adresse) {
            <h3 class="entreprise-section">Adresse</h3>
            <ul class="list-group">
              <li class="list-group-item">{{ ent.adresse.adresse1 || '—' }}</li>
              <li class="list-group-item">{{ ent.adresse.adresse2 }}</li>
              <li class="list-group-item"><span class="tnum">{{ ent.adresse.codePostale }}</span> {{ ent.adresse.ville }}</li>
              <li class="list-group-item">{{ ent.adresse.pays }}</li>
            </ul>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .entreprise-card { max-width: 640px; padding: var(--sp-lg); display: flex; flex-direction: column; gap: var(--sp-md); }
    .entreprise-nom { margin: 0; }
    .entreprise-section { margin: var(--sp-sm) 0 0; }
  `]
})
export class PageEntrepriseComponent implements OnInit {

  readonly entreprise = signal<EntrepriseDto | null>(null);
  readonly errorMsg = signal('');
  readonly chargement = signal(false);

  constructor(
    private userService: UserService,
    private entrepriseService: EntrepriseService
  ) { }

  ngOnInit(): void {
    const idEntreprise = this.userService.getConnectedUser()?.entreprise?.id;
    if (!idEntreprise) {
      this.errorMsg.set('Aucune entreprise associee au compte connecte');
      return;
    }
    this.chargement.set(true);
    this.entrepriseService.findById(idEntreprise)
      .subscribe(ent => {
        this.entreprise.set(ent ?? null);
        this.chargement.set(false);
      }, error => {
        this.errorMsg.set(error?.error?.message || 'Erreur lors du chargement de l entreprise');
        this.chargement.set(false);
      });
  }
}
