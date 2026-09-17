import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {VentesService} from '../../../gs-api/src/services/ventes.service';
import {VentesDto} from '../../../gs-api/src/models/ventes-dto';
import {ArticlesService} from '../../../gs-api/src/services/articles.service';
import {LigneVenteDto} from '../../../gs-api/src/models/ligne-vente-dto';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentesServiceApp {

  constructor(
    private userService: UserService,
    private ventesService: VentesService,
    private articlesService: ArticlesService
  ) { }

  enregistrerVente(venteDto: VentesDto): Observable<VentesDto> {
    venteDto.idEntreprise = this.userService.getConnectedUser().entreprise?.id;
    // Convention projet : dates ISO-8601 (le backend rejette les epoch millis)
    venteDto.dateVente = new Date().toISOString() as any;
    return this.ventesService.save(venteDto);
  }

  findAllVentes(): Observable<Array<VentesDto>> {
    return this.ventesService.findAll();
  }

  findVenteById(idVente?: number): Observable<VentesDto> {
    if (idVente) {
      return this.ventesService.findById(idVente);
    }
    return of();
  }

  findVenteByCode(codeVente?: string): Observable<VentesDto> {
    if (codeVente) {
      return this.ventesService.findByCode(codeVente);
    }
    return of();
  }

  deleteVente(idVente: number): Observable<any> {
    if (idVente) {
      return this.ventesService.delete(idVente);
    }
    return of();
  }

  findLignesVenteArticle(idArticle?: number): Observable<Array<LigneVenteDto>> {
    if (idArticle) {
      return this.articlesService.findHistoriqueVentes(idArticle);
    }
    return of();
  }
}
