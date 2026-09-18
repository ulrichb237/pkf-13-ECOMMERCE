import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {Router} from '@angular/router';
import {UtilisateurDto} from '../../../../gs-api/src/models/utilisateur-dto';
import {UserService} from '../../../services/user/user.service';
import {NotificationService} from '../../../services/notification/notification.service';
import {BouttonActionComponent} from '../../../composants/boutton-action/boutton-action.component';
import {DetailUtilisateurComponent} from '../../../composants/detail-utilisateur/detail-utilisateur.component';
import {PaginationComponent} from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, BouttonActionComponent, DetailUtilisateurComponent, PaginationComponent],
  selector: 'app-page-utilisateur',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-utilisateur.component.html',
  styleUrls: ['./page-utilisateur.component.scss']
})
export class PageUtilisateurComponent implements OnInit {

  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly listUtilisateur = signal<Array<UtilisateurDto>>([]);
  readonly errorMsg = signal('');
  /** utilisateur en attente de confirmation de suppression */
  readonly utilisateurASupprimer = signal<UtilisateurDto | null>(null);

  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.findAllUtilisateurs();
  }

  findAllUtilisateurs(): void {
    this.userService.findAllUtilisateurs().subscribe(utilisateurs => {
      this.listUtilisateur.set(utilisateurs || []);
    }, error => {
      this.errorMsg.set(error?.error?.message || 'Erreur lors du chargement des utilisateurs');
    });
  }

  nouvelUtilisateur(): void {
    this.router.navigate(['nouvelutilisateur']);
  }

  /** Ouvre la fiche en mode edition : charge GET /utilisateurs/{id} */
  ouvrirFiche(utilisateur: UtilisateurDto): void {
    if (utilisateur.id) {
      this.router.navigate(['nouvelutilisateur', utilisateur.id]);
    }
  }

  demanderSuppression(utilisateur: UtilisateurDto): void {
    this.utilisateurASupprimer.set(utilisateur);
  }

  annulerSuppression(): void {
    this.utilisateurASupprimer.set(null);
  }

  confirmerSuppression(): void {
    const utilisateur = this.utilisateurASupprimer();
    if (!utilisateur?.id) {
      return;
    }
    this.userService.deleteUtilisateur(utilisateur.id)
      .subscribe(() => {
        this.notificationService.success('Utilisateur supprime');
        this.utilisateurASupprimer.set(null);
        this.findAllUtilisateurs();
      }, error => {
        this.notificationService.error(CmdcltfrsMsg(error));
        this.utilisateurASupprimer.set(null);
      });
  }
}

/** Extrait le message lisible d'une erreur backend */
function CmdcltfrsMsg(error: any): string {
  return error?.error?.message || error?.message || 'Erreur lors de la suppression';
}
