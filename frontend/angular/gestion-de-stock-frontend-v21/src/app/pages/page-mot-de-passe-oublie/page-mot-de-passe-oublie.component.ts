import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { UserService } from '../../services/user/user.service';
import { ForgotPasswordResponse } from '../../../gs-api/src/models/forgot-password-response';

/**
 * Parcours "mot de passe oublie" en 2 etapes :
 * 1. l'utilisateur saisit son email, un code a 6 chiffres est genere (valable 15 min) ;
 * 2. il saisit le code + son nouveau mot de passe.
 *
 * Sans serveur SMTP configure, le backend renvoie le code dans la reponse :
 * il est affiche dans un encadre info pour permettre au parcours de fonctionner.
 */
@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-page-mot-de-passe-oublie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-mot-de-passe-oublie.component.html',
  styleUrls: ['./page-mot-de-passe-oublie.component.scss']
})
export class PageMotDePasseOublieComponent {

  email = '';
  code = '';
  nouveauMotDePasse = '';
  confirmation = '';

  readonly etape = signal<1 | 2>(1);
  readonly codeAffiche = signal<string>('');
  readonly message = signal<string>('');
  readonly erreur = signal<string>('');
  readonly chargement = signal<boolean>(false);

  constructor(private userService: UserService) { }

  demanderCode(): void {
    if (!this.email) {
      this.erreur.set('Veuillez saisir votre email');
      return;
    }
    this.chargement.set(true);
    this.erreur.set('');
    this.userService.forgotPassword(this.email).subscribe({
      next: (reponse: ForgotPasswordResponse) => {
        this.chargement.set(false);
        this.message.set(reponse?.message || 'Si un compte existe, un code vient d\'etre genere.');
        if (reponse?.code) {
          // SMTP non configure : le code est affiche directement (voir MODIFICATIONS_BACKEND.md)
          this.codeAffiche.set(reponse.code);
          this.code = reponse.code;
        }
        this.etape.set(2);
      },
      error: () => {
        this.chargement.set(false);
        this.erreur.set('Erreur lors de la demande, veuillez reessayer');
      }
    });
  }

  reinitialiser(): void {
    if (!this.code) {
      this.erreur.set('Veuillez saisir le code recu');
      return;
    }
    if (this.nouveauMotDePasse.length < 6) {
      this.erreur.set('Le mot de passe doit contenir au moins 6 caracteres');
      return;
    }
    if (this.nouveauMotDePasse !== this.confirmation) {
      this.erreur.set('Les deux mots de passe ne correspondent pas');
      return;
    }
    this.chargement.set(true);
    this.erreur.set('');
    this.userService.reinitialiserMotDePasse(this.code, this.nouveauMotDePasse).subscribe({
      next: () => {
        this.chargement.set(false);
        this.message.set('Mot de passe reinitialise avec succes. Vous pouvez vous connecter.');
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err?.error?.message || 'Code invalide ou expire, demandez-en un nouveau');
      }
    });
  }
}
