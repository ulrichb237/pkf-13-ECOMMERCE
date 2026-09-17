import { Component, Input, OnInit } from '@angular/core';
import { UtilisateurDto } from '../../../gs-api/src/models/utilisateur-dto';

@Component({
  selector: 'app-detail-utilisateur',
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.scss']
})
export class DetailUtilisateurComponent implements OnInit {

  @Input()
  utilisateur: UtilisateurDto = {};

  constructor() { }

  ngOnInit(): void {
  }

}
