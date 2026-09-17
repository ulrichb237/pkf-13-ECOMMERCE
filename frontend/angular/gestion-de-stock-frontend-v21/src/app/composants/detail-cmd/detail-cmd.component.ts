import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LigneCommandeClientDto } from '../../../gs-api/src/models/ligne-commande-client-dto';

/**
 * Ligne de commande :
 * - edition de quantite inline -> PATCH .../lignes/{id}/quantite/{quantite}
 * - suppression de ligne       -> DELETE .../lignes/{id}
 * Les actions ne sont proposees que si modifiable() (etat != LIVREE).
 */
@Component({
  selector: 'app-detail-cmd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, FormsModule],
  templateUrl: './detail-cmd.component.html',
  styleUrls: ['./detail-cmd.component.scss']
})
export class DetailCmdComponent {

  ligneCommande = input.required<LigneCommandeClientDto>();
  origin = input('client');
  /** La ligne est-elle editable ? (false si la commande est LIVREE) */
  modifiable = input(true);
  suppressionLigne = output<LigneCommandeClientDto>();
  quantiteModifiee = output<{ ligne: LigneCommandeClientDto; quantite: number }>();

  /** Etat de la confirmation inline (remplace la modale Bootstrap) */
  readonly confirmationVisible = signal(false);
  /** Edition de quantite en cours : valeur saisie, null = lecture seule */
  readonly quantiteEnEdition = signal<number | null>(null);
  /** PATCH en cours : desactive les actions de la ligne */
  readonly operationEnCours = signal(false);

  /** Pont ngModel <-> signal pour l'input de quantite */
  get quantiteEditValue(): number | null {
    return this.quantiteEnEdition();
  }
  set quantiteEditValue(value: number | null) {
    this.quantiteEnEdition.set(value);
  }

  demanderConfirmation(): void {
    this.confirmationVisible.set(true);
  }

  annulerConfirmation(): void {
    this.confirmationVisible.set(false);
  }

  supprimerLigne(): void {
    this.confirmationVisible.set(false);
    this.suppressionLigne.emit(this.ligneCommande());
  }

  debuterEditionQuantite(): void {
    const q = this.ligneCommande().quantite;
    this.quantiteEnEdition.set(q ? +q : 1);
  }

  annulerEditionQuantite(): void {
    this.quantiteEnEdition.set(null);
  }

  validerQuantite(): void {
    const nouvelleQuantite = this.quantiteEnEdition();
    const ligne = this.ligneCommande();
    if (nouvelleQuantite == null || !ligne.id || !ligne.quantite) {
      this.quantiteEnEdition.set(null);
      return;
    }
    if (nouvelleQuantite === +ligne.quantite || nouvelleQuantite < 1) {
      this.quantiteEnEdition.set(null);
      return;
    }
    this.operationEnCours.set(true);
    this.quantiteModifiee.emit({ ligne, quantite: nouvelleQuantite });
  }

  /** Appele par la page une fois le PATCH termine (succes ou echec) */
  finOperation(): void {
    this.operationEnCours.set(false);
    this.quantiteEnEdition.set(null);
  }
}
