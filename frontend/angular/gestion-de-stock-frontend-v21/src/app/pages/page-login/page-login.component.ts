import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {AuthenticationRequest} from '../../../gs-api/src/models/authentication-request';
import {Router} from '@angular/router';

@Component({
  imports: [NgIf, FormsModule, RouterLink],
  selector: 'app-page-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent {

  authenticationRequest: AuthenticationRequest = {};
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  // tslint:disable-next-line:typedef
  login() {
    this.userService.login(this.authenticationRequest).subscribe((data) => {
      this.userService.setAccessToken(data);
      // Le profil est charge AVANT la navigation : sinon la page d'arrivee
      // demarre sans connectedUser (race constatee sur entreprise / header).
      this.getUserByEmail();
    }, error => {
      this.errorMessage = 'Login et / ou mot de passe incorrecte';
    });
  }

  getUserByEmail(): void {
    this.userService.getUserByEmail(this.authenticationRequest.login)
    .subscribe(user => {
      this.userService.setConnectedUser(user);
      this.router.navigate(['']);
    }, () => {
      // Profil indisponible : on ne bloque pas la connexion, l'utilisateur
      // verra une erreur explicite sur les pages dependantes du profil.
      this.router.navigate(['']);
    });
  }

}
