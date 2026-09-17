import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  imports: [NgIf],
  selector: 'app-detail-mvt-stk-article',
  templateUrl: './detail-mvt-stk-article.component.html',
  styleUrls: ['./detail-mvt-stk-article.component.scss']
})
export class DetailMvtStkArticleComponent implements OnInit {

  /** Visibilite du dialog de correction (remplace la modale Bootstrap) */
  correctionVisible = false;

  constructor() { }

  ngOnInit(): void {
  }

}
