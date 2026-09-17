import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {Router} from '@angular/router';
import {CltfrsService} from '../../../services/cltfrs/cltfrs.service';
import {ClientDto} from '../../../../gs-api/src/models/client-dto';

import { BouttonActionComponent } from '../../../composants/boutton-action/boutton-action.component';

import { DetailCltFrsComponent } from '../../../composants/detail-clt-frs/detail-clt-frs.component';

import { PaginationComponent } from '../../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, BouttonActionComponent, DetailCltFrsComponent, PaginationComponent],
  selector: 'app-page-client',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.scss']
})
export class PageClientComponent implements OnInit {

  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly listClient = signal<Array<ClientDto>>([]);
  readonly errorMsg = signal('');

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
      this.listClient.set(clients || []);
    });
  }

  nouveauClient(): void {
    this.router.navigate(['nouveauclient']);
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findAllClients();
    } else {
      this.errorMsg.set(event);
    }
  }
}
