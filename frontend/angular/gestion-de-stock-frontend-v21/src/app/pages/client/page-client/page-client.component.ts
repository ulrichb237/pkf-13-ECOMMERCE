import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CltfrsService} from '../../../services/cltfrs/cltfrs.service';
import {ClientDto} from '../../../../gs-api/src/models/client-dto';

import { BouttonActionComponent } from '../../../composants/boutton-action/boutton-action.component';

import { DetailCltFrsComponent } from '../../../composants/detail-clt-frs/detail-clt-frs.component';

import { PaginationComponent } from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, BouttonActionComponent, DetailCltFrsComponent, PaginationComponent],
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.scss']
})
export class PageClientComponent implements OnInit {

  listClient: Array<ClientDto> = [];
  errorMsg = '';

  constructor(
    private router: Router,
    private cltFrsService: CltfrsService
  ) { }

  ngOnInit(): void {
    this.findAllClients();
  }

  findAllClients(): void {
    this.cltFrsService.findAllClients()
    .subscribe(clients => {
      this.listClient = clients;
    });
  }

  nouveauClient(): void {
    this.router.navigate(['nouveauclient']);
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findAllClients();
    } else {
      this.errorMsg = event;
    }
  }
}
