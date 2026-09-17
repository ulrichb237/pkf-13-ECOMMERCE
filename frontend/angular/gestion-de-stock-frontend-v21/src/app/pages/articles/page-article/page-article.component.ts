import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {ArticleService} from '../../../services/article/article.service';
import {LigneVenteDto} from '../../../../gs-api/src/models/ligne-vente-dto';
import {LigneCommandeClientDto} from '../../../../gs-api/src/models/ligne-commande-client-dto';
import {LigneCommandeFournisseurDto} from '../../../../gs-api/src/models/ligne-commande-fournisseur-dto';

import { BouttonActionComponent } from '../../../composants/boutton-action/boutton-action.component';

import { DetailArticleComponent } from '../../../composants/detail-article/detail-article.component';

import { PaginationComponent } from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, DatePipe, BouttonActionComponent, DetailArticleComponent, PaginationComponent],
  selector: 'app-page-article',
  templateUrl: './page-article.component.html',
  styleUrls: ['./page-article.component.scss']
})
export class PageArticleComponent implements OnInit {

  listArticle: Array<ArticleDto> = [];
  errorMsg = '';

  articleSelectionne: ArticleDto = {};
  historiqueVentes: Array<LigneVenteDto> = [];
  historiqueCmdClient: Array<LigneCommandeClientDto> = [];
  historiqueCmdFournisseur: Array<LigneCommandeFournisseurDto> = [];

  /** Onglet actif du panneau historiques (remplace data-toggle=tab Bootstrap) */
  ongletActif: 'ventes' | 'cmdClt' | 'cmdFrs' = 'ventes';
  /** Visibilite du panneau historiques (remplace la modale Bootstrap) */
  detailsVisibles = false;

  constructor(
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.findListArticle();
  }

  findListArticle(): void {
    this.articleService.findAllArticles()
    .subscribe(articles => {
      this.listArticle = articles;
    }, error => {
      this.errorMsg = error?.error?.message || 'Erreur lors du chargement des articles';
    });
  }

  voirDetails(article?: ArticleDto): void {
    this.errorMsg = '';
    this.historiqueVentes = [];
    this.historiqueCmdClient = [];
    this.historiqueCmdFournisseur = [];
    this.ongletActif = 'ventes';
    if (!article?.id) {
      return;
    }
    this.articleSelectionne = article;
    this.detailsVisibles = true;
    this.articleService.findHistoriqueVentes(article.id)
      .subscribe(ventes => this.historiqueVentes = ventes || []);
    this.articleService.findHistoriqueCommandeClient(article.id)
      .subscribe(cmds => this.historiqueCmdClient = cmds || []);
    this.articleService.findHistoriqueCommandeFournisseur(article.id)
      .subscribe(cmds => this.historiqueCmdFournisseur = cmds || []);
  }

  fermerDetails(): void {
    this.detailsVisibles = false;
  }

  nouvelArticle(): void {
    this.router.navigate(['nouvelarticle']);
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findListArticle();
    } else {
      this.errorMsg = event;
    }
  }
}
