import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {VentesServiceApp} from '../../../services/ventes/ventes.service';
import {VentesDto} from '../../../../gs-api/src/models/ventes-dto';
import {LigneVenteDto} from '../../../../gs-api/src/models/ligne-vente-dto';
import {ArticleService} from '../../../services/article/article.service';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';

import { BouttonActionComponent } from '../../../composants/boutton-action/boutton-action.component';

import { PaginationComponent } from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, DatePipe, BouttonActionComponent, PaginationComponent],
  selector: 'app-page-ventes',
  templateUrl: './page-ventes.component.html',
  styleUrls: ['./page-ventes.component.scss']
})
export class PageVentesComponent implements OnInit {

  listVentes: Array<VentesDto> = [];
  errorMsg = '';

  constructor(
    private router: Router,
    private ventesService: VentesServiceApp
  ) { }

  nouvelleVente(): void {
    this.router.navigate(['nouvellevelle']);
  }

  ngOnInit(): void {
    this.findAllVentes();
  }

  findAllVentes(): void {
    this.ventesService.findAllVentes()
    .subscribe(ventes => {
      this.listVentes = ventes;
    }, error => {
      this.errorMsg = 'Erreur lors du chargement des ventes';
    });
  }
}
