import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CltfrsService} from '../../../services/cltfrs/cltfrs.service';
import {ClientDto} from '../../../../gs-api/src/models/client-dto';
import {FournisseurDto} from '../../../../gs-api/src/models/fournisseur-dto';

import { BouttonActionComponent } from '../../../composants/boutton-action/boutton-action.component';

import { DetailCltFrsComponent } from '../../../composants/detail-clt-frs/detail-clt-frs.component';

import { PaginationComponent } from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, BouttonActionComponent, DetailCltFrsComponent, PaginationComponent],
  selector: 'app-page-fournisseur',
  templateUrl: './page-fournisseur.component.html',
  styleUrls: ['./page-fournisseur.component.scss']
})
export class PageFournisseurComponent implements OnInit {

  listFournisseur: Array<FournisseurDto> = [];
  errorMsg = '';

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
      this.listFournisseur = fournisseurs;
    });
  }

  nouveauFournisseur(): void {
    this.router.navigate(['nouveaufournisseur']);
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findAllFournisseurs();
    } else {
      this.errorMsg = event;
    }
  }
}
