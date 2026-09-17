import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UtilisateurDto } from '../../../gs-api/src/models/utilisateur-dto';

@Component({
  selector: 'app-detail-utilisateur',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.scss']
})
export class DetailUtilisateurComponent {

  utilisateur = input.required<UtilisateurDto>();

}
