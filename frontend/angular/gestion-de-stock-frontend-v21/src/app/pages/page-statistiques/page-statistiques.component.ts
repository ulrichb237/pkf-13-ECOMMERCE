import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { ArticleDto } from '../../../gs-api/src/models/article-dto';
import { ArticleService } from '../../services/article/article.service';
import { VentesServiceApp } from '../../services/ventes/ventes.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { LigneVenteDto } from '../../../gs-api/src/models/ligne-vente-dto';
import { LigneCommandeClientDto } from '../../../gs-api/src/models/ligne-commande-client-dto';
import { LigneCommandeFournisseurDto } from '../../../gs-api/src/models/ligne-commande-fournisseur-dto';

/**
 * Page statistiques.
 *
 * Contrainte backend : les endpoints d'historique (ventes / commandes client /
 * fournisseur) existent uniquement PAR ARTICLE, et les listes globales
 * (GET /ventes, GET /commandes-*) ne embarquent pas leurs lignes (fromEntity
 * ne les peuple pas). Un chargement automatique pour tous les articles
 * provoquerait une tempete de requetes (2 x N appels) : la page propose donc
 * un selecteur d'article, et charge les 3 historiques a la selection.
 */
@Component({
  imports: [NgIf, NgFor, DatePipe, FormsModule],
  selector: 'app-page-statistiques',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-statistiques.component.html',
  styleUrls: ['./page-statistiques.component.scss']
})
export class PageStatistiquesComponent implements OnInit {

  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly listArticle = signal<Array<ArticleDto>>([]);
  readonly lignesVentes = signal<Array<LigneVenteDto>>([]);
  readonly lignesCmdClient = signal<Array<LigneCommandeClientDto>>([]);
  readonly lignesCmdFournisseur = signal<Array<LigneCommandeFournisseurDto>>([]);
  readonly chargement = signal(false);
  readonly errorMsg = signal('');

  /** Champ du selecteur (evenement ngModel -> CD deja declenchee) */
  articleSelectionneId: number | null = null;

  constructor(
    private articleService: ArticleService,
    private ventesService: VentesServiceApp,
    private cmdCltFrsService: CmdcltfrsService
  ) { }

  ngOnInit(): void {
    this.chargerArticles();
  }

  /** Au chargement : la liste des articles seulement (1 requete) */
  chargerArticles(): void {
    this.articleService.findAllArticles()
      .pipe(take(1))
      .subscribe(articles => {
        this.listArticle.set(articles || []);
      }, error => {
        this.errorMsg.set(VentesServiceApp.errorMsg(error));
      });
  }

  /** A la selection d'un article : les 3 historiques en parallel (forkJoin) */
  chargerStatistiques(): void {
    this.lignesVentes.set([]);
    this.lignesCmdClient.set([]);
    this.lignesCmdFournisseur.set([]);
    if (!this.articleSelectionneId) {
      return;
    }
    this.chargement.set(true);
    const id = this.articleSelectionneId;
    forkJoin({
      ventes: this.articleService.findHistoriqueVentes(id).pipe(take(1), catchError(() => of([]))),
      cmdClient: this.articleService.findHistoriqueCommandeClient(id).pipe(take(1), catchError(() => of([]))),
      cmdFournisseur: this.articleService.findHistoriqueCommandeFournisseur(id).pipe(take(1), catchError(() => of([])))
    }).subscribe(({ ventes, cmdClient, cmdFournisseur }) => {
      this.lignesVentes.set(ventes || []);
      this.lignesCmdClient.set(cmdClient || []);
      this.lignesCmdFournisseur.set(cmdFournisseur || []);
      this.chargement.set(false);
    }, () => this.chargement.set(false));
  }
}

/** Vente agregee pour affichage (code + total) */
interface VentesAggregees {
  code?: string;
  total?: number;
}
