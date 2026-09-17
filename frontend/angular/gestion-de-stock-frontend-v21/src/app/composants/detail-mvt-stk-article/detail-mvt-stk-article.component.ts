import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  imports: [NgIf],
  selector: 'app-detail-mvt-stk-article',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-mvt-stk-article.component.html',
  styleUrls: ['./detail-mvt-stk-article.component.scss']
})
export class DetailMvtStkArticleComponent {

  /** Visibilite du dialog de correction (remplace la modale Bootstrap) */
  correctionVisible = false;

}
