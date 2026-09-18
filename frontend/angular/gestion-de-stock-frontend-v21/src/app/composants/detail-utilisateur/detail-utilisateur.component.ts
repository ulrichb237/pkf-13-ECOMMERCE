import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UtilisateurDto } from '../../../gs-api/src/models/utilisateur-dto';

@Component({
  selector: 'app-detail-utilisateur',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.scss']
})
export class DetailUtilisateurComponent {

  utilisateur = input.required<UtilisateurDto>();
  /** Ouvre la fiche (GET /utilisateurs/{id} via la page d'edition) */
  ficheDemandee = output<UtilisateurDto>();
  /** Demande la suppression (confirmation geree par la page) */
  suppressionDemandee = output<UtilisateurDto>();

  ouvrirFiche(): void {
    this.ficheDemandee.emit(this.utilisateur());
  }

  demanderSuppression(): void {
    this.suppressionDemandee.emit(this.utilisateur());
  }
}
