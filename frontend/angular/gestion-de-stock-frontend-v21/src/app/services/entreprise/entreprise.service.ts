import { Injectable } from '@angular/core';
import {EntreprisesService} from '../../../gs-api/src/services/entreprises.service';
import {EntrepriseDto} from '../../../gs-api/src/models/entreprise-dto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(
    private entreprisesService: EntreprisesService
  ) { }

  sinscrire(entreprise: EntrepriseDto): Observable<EntrepriseDto> {
    return this.entreprisesService.save(entreprise);
  }

  /** GET /api/v1/entreprises — liste (administration) */
  findAll(): Observable<EntrepriseDto[]> {
    return this.entreprisesService.findAll();
  }

  /** GET /api/v1/entreprises/{idEntreprise} — fiche entreprise */
  findById(idEntreprise?: number): Observable<EntrepriseDto> {
    if (idEntreprise) {
      return this.entreprisesService.findById(idEntreprise);
    }
    // Fiche par defaut (utilisateur non connecte) : objet vide
    return new Observable<EntrepriseDto>(observer => observer.next({}));
  }
}
