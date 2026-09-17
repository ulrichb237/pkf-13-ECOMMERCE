import { Component, OnInit } from '@angular/core';
import {EntrepriseDto} from '../../../gs-api/src/models/entreprise-dto';
import {EntrepriseService} from '../../services/entreprise/entreprise.service';
import {AdresseDto} from '../../../gs-api/src/models/adresse-dto';
import {Router} from '@angular/router';

@Component({
  selector: 'app-page-inscription',
  templateUrl: './page-inscription.component.html',
  styleUrls: ['./page-inscription.component.scss']
})
export class PageInscriptionComponent implements OnInit {

  entrepriseDto: EntrepriseDto = {};
  adresse: AdresseDto = {};
  errorsMsg: Array<string> = [];

  constructor(
    private entrepriseService: EntrepriseService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  inscrire(): void {
    this.entrepriseDto.adresse = this.adresse;
    this.entrepriseService.sinscrire(this.entrepriseDto)
    .subscribe(entrepriseDto => {
      // Inscription reussie : le backend a cree l'entreprise et son compte admin.
      // Le mot de passe initial du compte admin est defini par le backend
      // (ENTREPRISE_DEFAULT_PASSWORD du fichier .env) : l'utilisateur se connecte
      // ensuite via la page de login, puis peut changer son mot de passe
      // depuis la page "changermotdepasse".
      this.router.navigate(['login']);
    }, error => {
      this.errorsMsg = error.error.errors;
      });
  }
}
