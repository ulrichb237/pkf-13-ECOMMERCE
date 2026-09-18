import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilisateurDto } from '../../../../gs-api/src/models/utilisateur-dto';
import { UserService } from '../../../services/user/user.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AdresseDto } from '../../../../gs-api/src/models/adresse-dto';

/**
 * Creation / fiche utilisateur (admin).
 * POST /api/v1/utilisateurs a la creation ; en edition, la modification du
 * mot de passe passe par la page dediee /changermotdepasse.
 *
 * Alignement backend : le champ mot de passe s'appelle `moteDePasse` (typo
 * historique du DTO backend), l'entreprise est un objet et la date de
 * naissance est obligatoire (UtilisateurValidator).
 */
@Component({
  imports: [NgIf, FormsModule],
  selector: 'app-nouvel-utilisateur',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nouvel-utilisateur.component.html',
  styleUrls: ['./nouvel-utilisateur.component.scss']
})
export class NouvelUtilisateurComponent implements OnInit {

  readonly utilisateurDto = signal<UtilisateurDto>({});
  readonly motDePasse = signal('');
  readonly confirmMotDePasse = signal('');
  readonly errorMsg = signal('');
  readonly chargement = signal(false);
  readonly modeEdition = signal(false);

  /** Valeur pour l'input date (YYYY-MM-DD) derivee de l'Instant du DTO */
  readonly dateNaissanceInput = computed(() => {
    const instant = this.utilisateurDto().dateDeNaissance;
    if (!instant) {
      return '';
    }
    return new Date(instant as unknown as string).toISOString().slice(0, 10);
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('idUtilisateur');
    if (id) {
      this.modeEdition.set(true);
      this.chargement.set(true);
      this.userService.findUtilisateurById(+id).subscribe(utilisateur => {
        this.utilisateurDto.set(utilisateur || {});
        this.chargement.set(false);
      }, error => {
        this.errorMsg.set(error?.error?.message || 'Erreur lors du chargement');
        this.chargement.set(false);
      });
    }
  }

  champ(champ: string, event: Event): void {
    const valeur = (event.target as HTMLInputElement).value;
    this.utilisateurDto.update(u => ({ ...u, [champ]: valeur }));
  }

  champAdresse(champ: keyof AdresseDto, event: Event): void {
    const valeur = (event.target as HTMLInputElement).value;
    this.utilisateurDto.update(u => ({
      ...u,
      adresse: { ...u.adresse, [champ]: valeur }
    }));
  }

  champDateNaissance(event: Event): void {
    const valeur = (event.target as HTMLInputElement).value;
    // Le backend attend un Instant : minuit UTC du jour selectionne
    const instant = valeur ? new Date(valeur + 'T00:00:00Z').toISOString() : undefined;
    this.utilisateurDto.update(u => ({
      ...u,
      dateDeNaissance: instant as unknown as number
    }));
  }

  enregistrer(): void {
    this.errorMsg.set('');
    const utilisateur = { ...this.utilisateurDto() };

    if (!utilisateur.nom || !utilisateur.prenom || !utilisateur.email) {
      this.errorMsg.set('Le nom, le prenom et l email sont obligatoires');
      return;
    }
    if (!utilisateur.dateDeNaissance) {
      this.errorMsg.set('La date de naissance est obligatoire');
      return;
    }

    if (!this.modeEdition()) {
      if (!this.motDePasse() || this.motDePasse().length < 6) {
        this.errorMsg.set('Le mot de passe doit contenir au moins 6 caracteres');
        return;
      }
      if (this.motDePasse() !== this.confirmMotDePasse()) {
        this.errorMsg.set('Les mots de passe ne correspondent pas');
        return;
      }
      utilisateur.moteDePasse = this.motDePasse();
    }

    // Rattachement a l'entreprise de l'admin connecte (multi-entreprise)
    if (!utilisateur.entreprise?.id) {
      const idEntreprise = this.userService.getConnectedUser()?.entreprise?.id;
      if (idEntreprise) {
        utilisateur.entreprise = { id: idEntreprise };
      }
    }

    this.chargement.set(true);
    this.userService.saveUtilisateur(utilisateur)
      .subscribe(() => {
        this.chargement.set(false);
        this.notificationService.success('Utilisateur enregistre');
        this.router.navigate(['utilisateurs']);
      }, error => {
        this.chargement.set(false);
        this.errorMsg.set(error?.error?.message || 'Erreur lors de l enregistrement');
      });
  }

  cancel(): void {
    this.router.navigate(['utilisateurs']);
  }
}
