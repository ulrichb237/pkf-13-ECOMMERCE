import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-article.component.html',
  styleUrls: ['./page-article.component.scss']
})
export class PageArticleComponent implements OnInit {

  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly listArticle = signal<Array<ArticleDto>>([]);
  readonly errorMsg = signal('');
  readonly articleSelectionne = signal<ArticleDto>({});
  readonly historiqueVentes = signal<Array<LigneVenteDto>>([]);
  readonly historiqueCmdClient = signal<Array<LigneCommandeClientDto>>([]);
  readonly historiqueCmdFournisseur = signal<Array<LigneCommandeFournisseurDto>>([]);
  /** Onglet actif du panneau historiques (remplace data-toggle=tab Bootstrap) */
  readonly ongletActif = signal<'ventes' | 'cmdClt' | 'cmdFrs'>('ventes');
  /** Visibilite du panneau historiques (remplace la modale Bootstrap) */
  readonly detailsVisibles = signal(false);

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
      this.listArticle.set(articles || []);
    }, error => {
      this.errorMsg.set(error?.error?.message || 'Erreur lors du chargement des articles');
    });
  }

  voirDetails(article?: ArticleDto): void {
    this.errorMsg.set('');
    this.historiqueVentes.set([]);
    this.historiqueCmdClient.set([]);
    this.historiqueCmdFournisseur.set([]);
    this.ongletActif.set('ventes');
    if (!article?.id) {
      return;
    }
    this.articleSelectionne.set(article);
    this.detailsVisibles.set(true);
    this.articleService.findHistoriqueVentes(article.id)
      .subscribe(ventes => this.historiqueVentes.set(ventes || []));
    this.articleService.findHistoriqueCommandeClient(article.id)
      .subscribe(cmds => this.historiqueCmdClient.set(cmds || []));
    this.articleService.findHistoriqueCommandeFournisseur(article.id)
      .subscribe(cmds => this.historiqueCmdFournisseur.set(cmds || []));
  }

  fermerDetails(): void {
    this.detailsVisibles.set(false);
  }

  nouvelArticle(): void {
    this.router.navigate(['nouvelarticle']);
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findListArticle();
    } else {
      this.errorMsg.set(event);
    }
  }
}
