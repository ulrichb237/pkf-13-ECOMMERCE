import { NgIf, NgFor } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';

@Component({
  selector: 'app-detail-cmd',
  templateUrl: './detail-cmd.component.html',
  styleUrls: ['./detail-cmd.component.scss']
})
export class DetailCmdComponent implements OnInit {

  @Input()
  ligneCommande: LigneCommandeClientDto = {};
  @Input()
  origin = 'client';
  @Output()
  suppressionLigne = new EventEmitter<LigneCommandeClientDto>();

  /** Etat de la confirmation inline (remplace la modale Bootstrap) */
  confirmationVisible = false;

  constructor() { }

  ngOnInit(): void {
  }

  demanderConfirmation(): void {
    this.confirmationVisible = true;
  }

  annulerConfirmation(): void {
    this.confirmationVisible = false;
  }

  supprimerLigne(): void {
    this.confirmationVisible = false;
    this.suppressionLigne.emit(this.ligneCommande);
  }
}
