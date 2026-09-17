import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { UtilisateurDto } from '../../../gs-api/src/models/utilisateur-dto';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  connectedUser: UtilisateurDto;

  constructor(userService: UserService) {
    // Lu une seule fois a la construction du shell : le header affiche
    // l'utilisateur de la session courante.
    this.connectedUser = userService.getConnectedUser();
  }

}
