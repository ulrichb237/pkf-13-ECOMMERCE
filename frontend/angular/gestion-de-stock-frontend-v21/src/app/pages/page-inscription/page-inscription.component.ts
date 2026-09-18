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

  /** Erreurs de validation backend — signal : ecrit depuis un callback HTTP (zoneless-safe) */
  readonly errorsMsg = signal<Array<string>>([]);

  constructor(
    private entrepriseService: EntrepriseService,
    private router: Router
  ) { }

  inscrire(): void {
    this.entrepriseDto.adresse = this.adresse;
    this.entrepriseService.sinscrire(this.entrepriseDto)
    .subscribe(entrepriseDto => {
      // Inscription reussie : le backend a cree l'entreprise et son compte admin.
      // Le mot de passe initial du compte admin est defini par le backend
      // (ENTREPRISE_DEFAULT_PASSWORD du fichier .env) : l'utilisateur se connecte
      // ensuite via la page de login, puis peut changer son mot de passe
      // depuis la page "changermotdepasse".
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
