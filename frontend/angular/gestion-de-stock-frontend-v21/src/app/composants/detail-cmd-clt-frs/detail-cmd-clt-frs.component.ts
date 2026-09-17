import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ClientDto } from '../../../gs-api/src/models/client-dto';

@Component({
  imports: [DatePipe],
  selector: 'app-detail-cmd-clt-frs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-cmd-clt-frs.component.html',
  styleUrls: ['./detail-cmd-clt-frs.component.scss']
})
export class DetailCmdCltFrsComponent {

  origin = input('');
  commande = input.required<any>();

  /** Le client/fournisseur est derive de la commande et de l'origine */
  cltFrs = computed<ClientDto | undefined>(() => {
    const cmd = this.commande();
    if (this.origin() === 'client') {
      return cmd?.client;
    }
    if (this.origin() === 'fournisseur') {
      return cmd?.fournisseur;
    }
    return undefined;
  });

  modifierClick(): void {
  }
}
