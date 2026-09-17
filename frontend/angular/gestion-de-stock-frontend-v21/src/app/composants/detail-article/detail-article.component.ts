import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ArticleDto } from '../../../gs-api/src/models/article-dto';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article/article.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-detail-article',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss']
})
export class DetailArticleComponent {

  articleDto = input.required<ArticleDto>();
  suppressionResult = output<string | 'success'>();
  detailsResult = output<ArticleDto>();

  /** Etat de la confirmation inline (remplace la modale Bootstrap) */
  confirmationVisible = false;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private notificationService: NotificationService
  ) { }

  demanderConfirmation(): void {
    this.confirmationVisible = true;
  }

  annulerConfirmation(): void {
    this.confirmationVisible = false;
  }

  modifierArticle(): void {
    this.router.navigate(['nouvelarticle', this.articleDto().id]);
  }

  confirmerEtSupprimerArticle(): void {
    this.confirmationVisible = false;
    const id = this.articleDto().id;
    if (id) {
      this.articleService.deleteArticle(id)
      .subscribe(res => {
        this.notificationService.success('Article supprime');
        this.suppressionResult.emit('success');
      }, error => {
        this.suppressionResult.emit(error?.error?.message || 'Erreur lors de la suppression de l article');
      });
    }
  }
}
