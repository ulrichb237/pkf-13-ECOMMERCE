import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CategoryDto} from '../../../../gs-api/src/models/category-dto';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {CategoryService} from '../../../services/category/category.service';

import { BouttonActionComponent } from '../../../composants/boutton-action/boutton-action.component';

import { PaginationComponent } from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, BouttonActionComponent, PaginationComponent],
  selector: 'app-page-categories',
  templateUrl: './page-categories.component.html',
  styleUrls: ['./page-categories.component.scss']
})
export class PageCategoriesComponent implements OnInit {

  listCategories: Array<CategoryDto> = [];
  selectedCatIdToDelete ? = -1;
  errorMsgs = '';

  /** Confirmation de suppression (remplace la modale Bootstrap) */
  catASupprimer = false;
  /** Visibilite du panneau details (remplace la modale Bootstrap) */
  detailsVisibles = false;

  articlesCategorie: Array<ArticleDto> = [];
  codeCategorieSelectionnee = '';

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.findAllCategories();
  }

  voirDetails(categorie?: CategoryDto): void {
    this.errorMsgs = '';
    this.articlesCategorie = [];
    this.codeCategorieSelectionnee = categorie?.code ? categorie.code : '';
    this.detailsVisibles = true;
    if (categorie?.id) {
      this.categoryService.findAllArticleByCategorie(categorie.id)
        .subscribe(articles => {
          this.articlesCategorie = articles;
        }, error => {
          this.errorMsgs = error.error.message;
        });
    }
  }

  findAllCategories(): void {
    this.categoryService.findAll()
    .subscribe(res => {
      this.listCategories = res;
    });
  }

  nouvelleCategory(): void {
    this.router.navigate(['nouvellecategorie']);
  }

  modifierCategory(id?: number): void {
    this.router.navigate(['nouvellecategorie', id]);
  }

  confirmerEtSupprimerCat(): void {
    this.catASupprimer = false;
    const id = this.selectedCatIdToDelete;
    if (id !== undefined && id !== -1) {
      this.categoryService.delete(id)
      .subscribe(res => {
        this.findAllCategories();
      }, error => {
        this.errorMsgs = error?.error?.message || 'Erreur lors de la suppression';
      });
    }
  }

  annulerSuppressionCat(): void {
    this.selectedCatIdToDelete = -1;
  }

  selectCatPourSupprimer(id?: number): void {
    this.selectedCatIdToDelete = id;
    this.catASupprimer = true;
  }
}
