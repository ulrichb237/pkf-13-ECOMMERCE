import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {Router} from '@angular/router';
import {UtilisateurDto} from '../../../../gs-api/src/models/utilisateur-dto';
import {UserService} from '../../../services/user/user.service';
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

  constructor(
    private router: Router,
    private userService: UserService
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

  nouvelUtilosateur(): void {
    this.router.navigate(['nouvelutilisateur']);
  }
}
