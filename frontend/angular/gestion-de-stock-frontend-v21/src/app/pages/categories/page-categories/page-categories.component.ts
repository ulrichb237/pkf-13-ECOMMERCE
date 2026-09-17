import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {Router} from '@angular/router';
import {CategoryDto} from '../../../../gs-api/src/models/category-dto';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {CategoryService} from '../../../services/category/category.service';

import { BouttonActionComponent } from '../../../composants/boutton-action/boutton-action.component';

import { PaginationComponent } from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, BouttonActionComponent, PaginationComponent],
  selector: 'app-page-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-categories.component.html',
  styleUrls: ['./page-categories.component.scss']
})
export class PageCategoriesComponent implements OnInit {

  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly listCategories = signal<Array<CategoryDto>>([]);
  readonly errorMsgs = signal('');
  /** id de la categorie en attente de confirmation de suppression ; null = aucun dialog */
  readonly catASupprimer = signal<CategoryDto | null>(null);
  readonly detailsVisibles = signal(false);
  readonly articlesCategorie = signal<Array<ArticleDto>>([]);
  readonly codeCategorieSelectionnee = signal('');

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.findAllCategories();
  }

  voirDetails(categorie?: CategoryDto): void {
    this.errorMsgs.set('');
    this.articlesCategorie.set([]);
    this.codeCategorieSelectionnee.set(categorie?.code ? categorie.code : '');
    this.detailsVisibles.set(true);
    if (categorie?.id) {
      this.categoryService.findAllArticleByCategorie(categorie.id)
        .subscribe(articles => {
          this.articlesCategorie.set(articles || []);
        }, error => {
          this.errorMsgs.set(error?.error?.message || 'Erreur lors du chargement des articles');
        });
    }
  }

  fermerDetails(): void {
    this.detailsVisibles.set(false);
  }

  findAllCategories(): void {
    this.categoryService.findAll()
    .subscribe(res => {
      this.listCategories.set(res || []);
    });
  }

  nouvelleCategory(): void {
    this.router.navigate(['nouvellecategorie']);
  }

  modifierCategory(id?: number): void {
    this.router.navigate(['nouvellecategorie', id]);
  }

  confirmerEtSupprimerCat(): void {
    const categorie = this.catASupprimer();
    this.catASupprimer.set(null);
    if (categorie?.id) {
      this.categoryService.delete(categorie.id)
      .subscribe(res => {
        this.findAllCategories();
      }, error => {
        this.errorMsgs.set(error?.error?.message || 'Erreur lors de la suppression');
      });
    }
  }

  annulerSuppressionCat(): void {
    this.catASupprimer.set(null);
  }

  selectCatPourSupprimer(categorie: CategoryDto): void {
    this.catASupprimer.set(categorie);
  }
}
