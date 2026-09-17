import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {BouttonActionComponent} from '../../../composants/boutton-action/boutton-action.component';
import {DetailUtilisateurComponent} from '../../../composants/detail-utilisateur/detail-utilisateur.component';
import {PaginationComponent} from '../../../composants/pagination/pagination.component';

@Component({
  imports: [BouttonActionComponent, DetailUtilisateurComponent, PaginationComponent],
  selector: 'app-page-utilisateur',
  templateUrl: './page-utilisateur.component.html',
  styleUrls: ['./page-utilisateur.component.scss']
})
export class PageUtilisateurComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  nouvelUtilosateur(): void {
    this.router.navigate(['nouvelutilisateur']);
  }
}
