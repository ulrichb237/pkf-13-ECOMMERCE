import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {ArticleService} from '../../../services/article/article.service';
import {MvtstkServiceApp} from '../../../services/mvtstk/mvtstk.service';
import {MvtStkDto} from '../../../../gs-api/src/models/mvt-stk-dto';

@Component({
  imports: [NgIf, NgFor, FormsModule, DatePipe],
  selector: 'app-page-mvtstk',
  templateUrl: './page-mvtstk.component.html',
  styleUrls: ['./page-mvtstk.component.scss']
})
export class PageMvtstkComponent implements OnInit {

  listArticle: Array<ArticleDto> = [];
  mapMvtstk = new Map<number, Array<MvtStkDto>>();
  mapStockReel = new Map<number, number>();
  searchArticle = '';
  selectedArticle: ArticleDto = {};
  quantite = '';

  errorMsg = '';
  successMsg = '';

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
      this.listArticle = articles;
      this.listArticle.forEach(article => {
        this.chargerDonneesArticle(article);
      });
    }, error => {
      this.errorMsg = 'Erreur lors du chargement des articles';
    });
  }

  chargerDonneesArticle(article: ArticleDto): void {
    if (article.id) {
      this.mvtstkService.mvtStkArticle(article.id)
      .subscribe(mouvements => {
        this.mapMvtstk.set(article.id as number, mouvements);
      });
      this.mvtstkService.stockReelArticle(article.id)
      .subscribe(stock => {
        this.mapStockReel.set(article.id as number, stock);
      });
    }
  }

  filtrerArticle(): void {
    // le filtrage est fait dans le template via searchFilter()
  }

  searchFilter(): Array<ArticleDto> {
    if (!this.searchArticle) {
      return this.listArticle;
    }
    const s = this.searchArticle.toLowerCase();
    return this.listArticle.filter(art =>
      art.codeArticle?.toLowerCase().includes(s) || art.designation?.toLowerCase().includes(s)
    );
  }

  selectArticle(article: ArticleDto): void {
    this.selectedArticle = article;
    this.quantite = '';
    this.errorMsg = '';
    this.successMsg = '';
  }

  effectuerMouvement(typeMvt: 'ENTREE' | 'SORTIE' | 'CORRECTION_POS' | 'CORRECTION_NEG'): void {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.selectedArticle.id) {
      this.errorMsg = 'Veuillez selectionner un article';
      return;
    }
    const quantiteNum = +this.quantite;
    if (!quantiteNum || quantiteNum <= 0) {
      this.errorMsg = 'Veuillez renseigner une quantite valide';
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
      this.successMsg = 'Mouvement de stock effectue';
      this.chargerDonneesArticle(this.selectedArticle);
    }, error => {
      this.errorMsg = error?.error?.message || 'Erreur lors du mouvement de stock';
    });
  }
}
