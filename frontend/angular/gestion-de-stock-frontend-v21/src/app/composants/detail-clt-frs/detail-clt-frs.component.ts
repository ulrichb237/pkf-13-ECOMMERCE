import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ClientDto } from '../../../gs-api/src/models/client-dto';
import { Router } from '@angular/router';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-detail-clt-frs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-clt-frs.component.html',
  styleUrls: ['./detail-clt-frs.component.scss']
})
export class DetailCltFrsComponent {

  origin = input('');
  clientFournisseur = input<any>({});
  suppressionResult = output<string | 'success'>();

  /** Etat de la confirmation inline (remplace la modale Bootstrap) */
  confirmationVisible = false;
  /** Visibilite du panneau details (remplace la modale Bootstrap) */
  detailsVisibles = false;

  constructor(
    private router: Router,
    private cltFrsService: CltfrsService,
    private notificationService: NotificationService
  ) { }

  demanderConfirmation(): void {
    this.confirmationVisible = true;
  }

  annulerConfirmation(): void {
    this.confirmationVisible = false;
  }

  modifierClientFournisseur(): void {
    if (this.origin() === 'client') {
      this.router.navigate(['nouveauclient', this.clientFournisseur().id]);
    } else if (this.origin() === 'fournisseur') {
      this.router.navigate(['nouveaufournisseur', this.clientFournisseur().id]);
    }
  }

  confirmerEtSupprimer(): void {
    this.confirmationVisible = false;
    if (this.origin() === 'client') {
      this.cltFrsService.deleteClient(this.clientFournisseur().id)
      .subscribe(res => {
        this.notificationService.success('Client supprime');
        this.suppressionResult.emit('success');
      }, error => {
        this.suppressionResult.emit(CltfrsService.errorMsg(error));
      });
    } else if (this.origin() === 'fournisseur') {
      this.cltFrsService.deleteFournisseur(this.clientFournisseur().id)
      .subscribe(res => {
        this.notificationService.success('Fournisseur supprime');
        this.suppressionResult.emit('success');
      }, error => {
        this.suppressionResult.emit(CltfrsService.errorMsg(error));
      });
    }
  }
}
