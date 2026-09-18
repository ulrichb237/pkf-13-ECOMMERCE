import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {CategoriesService} from '../../../gs-api/src/services/categories.service';
import {ArticlesService} from '../../../gs-api/src/services/articles.service';
import {CategoryDto} from '../../../gs-api/src/models/category-dto';
import {ArticleDto} from '../../../gs-api/src/models/article-dto';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private userService: UserService,
    private categoryService: CategoriesService,
    private articlesService: ArticlesService
  ) { }

  enregistrerCategory(categoryDto: CategoryDto): Observable<CategoryDto> {
    categoryDto.idEntreprise = this.userService.getConnectedUser()?.entreprise?.id;
    return this.categoryService.save(categoryDto);
  }

  findAll(): Observable<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  findById(idCategory: number): Observable<CategoryDto> {
    return this.categoryService.findById(idCategory);
  }

  findByCode(codeCategory: string): Observable<CategoryDto> {
    if (codeCategory) {
      return this.categoryService.findByCode(codeCategory);
    }
    return of({});
  }

  delete(idCategorie?: number): Observable<any> {
    if (idCategorie) {
      return this.categoryService.delete(idCategorie);
    }
    return of();
  }

  findAllArticleByCategorie(idCategorie?: number): Observable<ArticleDto[]> {
    if (idCategorie) {
      return this.articlesService.findAllArticleByIdCategory(idCategorie);
    }
    return of([]);
  }
}
