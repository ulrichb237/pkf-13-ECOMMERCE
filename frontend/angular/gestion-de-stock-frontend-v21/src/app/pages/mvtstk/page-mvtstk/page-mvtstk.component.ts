import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {Router} from '@angular/router';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {ArticleService} from '../../../services/article/article.service';
import {MvtstkServiceApp} from '../../../services/mvtstk/mvtstk.service';
import {MvtStkDto} from '../../../../gs-api/src/models/mvt-stk-dto';

@Component({
  imports: [NgIf, NgFor, FormsModule, DatePipe],
  selector: 'app-page-mvtstk',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-mvtstk.component.html',
  styleUrls: ['./page-mvtstk.component.scss']
})
export class PageMvtstkComponent implements OnInit {

  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly listArticle = signal<Array<ArticleDto>>([]);
  readonly mapMvtstk = signal(new Map<number, Array<MvtStkDto>>());
  readonly mapStockReel = signal(new Map<number, number>());

  /** Champs de formulaire (evenements ngModel -> CD declenchee) */
  searchArticle = '';
  selectedArticle: ArticleDto = {};
  quantite = '';

  /** Etat d'ouverture de l'accordeon par article (reference recreee) */
  readonly articlesOuverts = signal(new Set<number>());

  readonly errorMsg = signal('');
  readonly successMsg = signal('');

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private mvtstkService: MvtstkServiceApp
  ) { }

  ngOnInit(): void {
    this.findAllArticles();
  }

  findAllArticles(): void {
    this.articleService.findAllArticles()
    .subscribe(articles => {
      this.listArticle.set(articles || []);
      this.listArticle().forEach(article => {
        this.chargerDonneesArticle(article);
      });
    }, error => {
      this.errorMsg.set('Erreur lors du chargement des articles');
    });
  }

  chargerDonneesArticle(article: ArticleDto): void {
    if (article.id) {
      this.mvtstkService.mvtStkArticle(article.id)
      .subscribe(mouvements => {
        this.mapMvtstk.update(m => new Map(m).set(article.id as number, mouvements || []));
      });
      this.mvtstkService.stockReelArticle(article.id)
      .subscribe(stock => {
        this.mapStockReel.update(m => new Map(m).set(article.id as number, stock));
      });
    }
  }

  filtrerArticle(): void {
    // le filtrage est fait dans le template via searchFilter()
  }

  /** Ouvre/ferme l'accordeon d'un article (remplace data-toggle=collapse) */
  basculerArticle(idArticle?: number): void {
    if (!idArticle) {
      return;
    }
    const nouveau = new Set(this.articlesOuverts());
    if (nouveau.has(idArticle)) {
      nouveau.delete(idArticle);
    } else {
      nouveau.add(idArticle);
    }
    this.articlesOuverts.set(nouveau);
  }

  searchFilter(): Array<ArticleDto> {
    if (!this.searchArticle) {
      return this.listArticle();
    }
    const s = this.searchArticle.toLowerCase();
    return this.listArticle().filter(art =>
      art.codeArticle?.toLowerCase().includes(s) || art.designation?.toLowerCase().includes(s)
    );
  }

  selectArticle(article: ArticleDto): void {
    this.selectedArticle = article;
    this.quantite = '';
    this.errorMsg.set('');
    this.successMsg.set('');
  }

  effectuerMouvement(typeMvt: 'ENTREE' | 'SORTIE' | 'CORRECTION_POS' | 'CORRECTION_NEG'): void {
    this.errorMsg.set('');
    this.successMsg.set('');
    if (!this.selectedArticle.id) {
      this.errorMsg.set('Veuillez selectionner un article');
      return;
    }
    const quantiteNum = +this.quantite;
    if (!quantiteNum || quantiteNum <= 0) {
      this.errorMsg.set('Veuillez renseigner une quantite valide');
      return;
    }
    const mvt: MvtStkDto = {
      article: { id: this.selectedArticle.id },
      quantite: quantiteNum,
      typeMvt
    };
    const requete = typeMvt === 'ENTREE' ? this.mvtstkService.entreeStock(mvt)
      : typeMvt === 'SORTIE' ? this.mvtstkService.sortieStock(mvt)
      : typeMvt === 'CORRECTION_POS' ? this.mvtstkService.correctionStockPos(mvt)
      : this.mvtstkService.correctionStockNeg(mvt);
    requete.subscribe(mvtResult => {
      this.successMsg.set('Mouvement de stock effectue');
      this.chargerDonneesArticle(this.selectedArticle);
    }, (error: any) => {
      this.errorMsg.set(error?.error?.message || 'Erreur lors du mouvement de stock');
    });
  }
}
