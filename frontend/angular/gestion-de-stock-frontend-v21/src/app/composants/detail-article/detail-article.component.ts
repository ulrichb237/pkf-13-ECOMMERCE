import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {ArticleDto} from '../../../gs-api/src/models/article-dto';
import {Router} from '@angular/router';
import {ArticleService} from '../../services/article/article.service';

@Component({
  imports: [NgIf],
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss']
})
export class DetailArticleComponent implements OnInit {

  @Input()
  articleDto: ArticleDto = {};
  @Output()
  suppressionResult = new EventEmitter();
  @Output()
  detailsResult = new EventEmitter<ArticleDto>();

  /** Etat de la confirmation inline (remplace la modale Bootstrap) */
  confirmationVisible = false;

  constructor(
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
  }

  demanderConfirmation(): void {
    this.confirmationVisible = true;
  }

  annulerConfirmation(): void {
    this.confirmationVisible = false;
  }

  modifierArticle(): void {
    this.router.navigate(['nouvelarticle', this.articleDto.id]);
  }

  confirmerEtSupprimerArticle(): void {
    this.confirmationVisible = false;
    if (this.articleDto.id) {
      this.articleService.deleteArticle(this.articleDto.id)
      .subscribe(res => {
        this.suppressionResult.emit('success');
      }, error => {
        this.suppressionResult.emit(error?.error?.message || 'Erreur lors de la suppression de l article');
      });
  }
  }
}
