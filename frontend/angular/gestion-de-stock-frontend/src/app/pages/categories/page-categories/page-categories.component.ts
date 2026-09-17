import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CategoryDto} from '../../../../gs-api/src/models/category-dto';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {CategoryService} from '../../../services/category/category.service';

@Component({
  selector: 'app-page-categories',
  templateUrl: './page-categories.component.html',
  styleUrls: ['./page-categories.component.scss']
})
export class PageCategoriesComponent implements OnInit {

  listCategories: Array<CategoryDto> = [];
  selectedCatIdToDelete ? = -1;
  errorMsgs = '';

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
    if (this.selectedCatIdToDelete !== -1) {
      this.categoryService.delete(this.selectedCatIdToDelete)
      .subscribe(res => {
        this.findAllCategories();
      }, error => {
        this.errorMsgs = error.error.message;
      });
    }
  }

  annulerSuppressionCat(): void {
    this.selectedCatIdToDelete = -1;
  }

  selectCatPourSupprimer(id?: number): void {
    this.selectedCatIdToDelete = id;
  }
}
