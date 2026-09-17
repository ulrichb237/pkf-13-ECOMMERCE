import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIf } from '@angular/common';
import { LigneCommandeClientDto } from '../../../gs-api/src/models/ligne-commande-client-dto';

@Component({
  selector: 'app-detail-cmd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
  templateUrl: './detail-cmd.component.html',
  styleUrls: ['./detail-cmd.component.scss']
})
export class DetailCmdComponent {

  ligneCommande = input.required<LigneCommandeClientDto>();
  origin = input('client');
  suppressionLigne = output<LigneCommandeClientDto>();

  /** Etat de la confirmation inline (remplace la modale Bootstrap) */
  confirmationVisible = false;

  demanderConfirmation(): void {
    this.confirmationVisible = true;
  }

  annulerConfirmation(): void {
    this.confirmationVisible = false;
  }

  supprimerLigne(): void {
    this.confirmationVisible = false;
    this.suppressionLigne.emit(this.ligneCommande());
  }
}
