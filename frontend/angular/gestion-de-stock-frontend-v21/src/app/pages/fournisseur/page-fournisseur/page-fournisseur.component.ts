import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {Router} from '@angular/router';
import {CltfrsService} from '../../../services/cltfrs/cltfrs.service';
import {FournisseurDto} from '../../../../gs-api/src/models/fournisseur-dto';

import { BouttonActionComponent } from '../../../composants/boutton-action/boutton-action.component';

import { DetailCltFrsComponent } from '../../../composants/detail-clt-frs/detail-clt-frs.component';

import { PaginationComponent } from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, BouttonActionComponent, DetailCltFrsComponent, PaginationComponent],
  selector: 'app-page-fournisseur',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-fournisseur.component.html',
  styleUrls: ['./page-fournisseur.component.scss']
})
export class PageFournisseurComponent implements OnInit {

  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly listFournisseur = signal<Array<FournisseurDto>>([]);
  readonly errorMsg = signal('');

  constructor(
    private router: Router,
    private cltFrsService: CltfrsService
  ) { }

  ngOnInit(): void {
    this.findAllFournisseurs();
  }

  findAllFournisseurs(): void {
    this.cltFrsService.findAllFournisseurs()
    .subscribe(fournisseurs => {
      this.listFournisseur.set(fournisseurs || []);
    });
  }

  nouveauFournisseur(): void {
    this.router.navigate(['nouveaufournisseur']);
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findAllFournisseurs();
    } else {
      this.errorMsg.set(event);
    }
  }
}
