import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {EntrepriseDto} from '../../../gs-api/src/models/entreprise-dto';
import {EntrepriseService} from '../../services/entreprise/entreprise.service';
import {AdresseDto} from '../../../gs-api/src/models/adresse-dto';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-page-inscription',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-inscription.component.html',
  styleUrls: ['./page-inscription.component.scss']
})
export class PageInscriptionComponent {

  entrepriseDto: EntrepriseDto = {};
  adresse: AdresseDto = {};

  /** Mot de passe choisi par l'utilisateur pour son compte admin (envoye via motDePasseAdmin) */
  motDePasse = '';
  confirmation = '';

  /** Erreurs de validation backend — signal : ecrit depuis un callback HTTP (zoneless-safe) */
  readonly errorsMsg = signal<Array<string>>([]);

  constructor(
    private entrepriseService: EntrepriseService,
    private router: Router
  ) { }

  inscrire(): void {
    if (this.motDePasse.length < 6) {
      this.errorsMsg.set(['Le mot de passe doit contenir au moins 6 caracteres']);
      return;
    }
    if (this.motDePasse !== this.confirmation) {
      this.errorsMsg.set(['Les deux mots de passe ne correspondent pas']);
      return;
    }
    this.entrepriseDto.adresse = this.adresse;
    this.entrepriseDto.motDePasseAdmin = this.motDePasse;
    this.entrepriseService.sinscrire(this.entrepriseDto)
    .subscribe(entrepriseDto => {
      // Inscription reussie : le backend a cree l'entreprise et le compte admin
      // avec le mot de passe choisi par l'utilisateur (champ motDePasseAdmin).
      this.router.navigate(['login']);
    }, error => {
      // Le backend renvoie une ErrorDto { code, httpCode, message, errors[] } :
      // soit une liste de violations de validation, soit un message unique.
      const errors = error?.error?.errors;
      this.errorsMsg.set(
        Array.isArray(errors) && errors.length
          ? errors
          : [error?.error?.message || 'Erreur lors de l inscription']
      );
    });
  }
}
