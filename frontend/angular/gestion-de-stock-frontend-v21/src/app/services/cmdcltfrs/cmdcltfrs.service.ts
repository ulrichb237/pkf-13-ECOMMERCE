import { Injectable } from '@angular/core';
import {CommandesclientsService} from '../../../gs-api/src/services/commandesclients.service';
import {CommandeClientDto} from '../../../gs-api/src/models/commande-client-dto';
import {Observable, of} from 'rxjs';
import {CommandeFournisseurDto} from '../../../gs-api/src/models/commande-fournisseur-dto';
import {CommandefournisseurService} from '../../../gs-api/src/services/commandefournisseur.service';
import {UserService} from '../user/user.service';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';
import {LigneCommandeFournisseurDto} from '../../../gs-api/src/models/ligne-commande-fournisseur-dto';

@Injectable({
  providedIn: 'root'
})
export class CmdcltfrsService {

  /** Extrait le message lisible d'une erreur HTTP du backend (ErrorDto). */
  static errorMsg(error: any): string {
    return error?.error?.message || error?.message || 'Une erreur est survenue';
  }

  constructor(
    private commandeClientService: CommandesclientsService,
    private commandeFournisseurService: CommandefournisseurService,
    private userService: UserService
  ) { }

  enregistrerCommandeClient(commandeClient: CommandeClientDto): Observable<CommandeClientDto> {
    commandeClient.idEntreprise = this.userService.getConnectedUser().entreprise?.id;
    return this.commandeClientService.save(commandeClient);
  }

  enregistrerCommandeFournisseur(commandeFournisseurDto: CommandeFournisseurDto): Observable<CommandeFournisseurDto> {
    commandeFournisseurDto.idEntreprise = this.userService.getConnectedUser().entreprise?.id;
    return this.commandeFournisseurService.save(commandeFournisseurDto);
  }

  findAllCommandesClient(): Observable<CommandeClientDto[]> {
    return this.commandeClientService.findAll();
  }

  findCommandeClientById(id?: number): Observable<CommandeClientDto> {
    if (id) {
      return this.commandeClientService.findById(id);
    }
    return of({});
  }

  findCommandeClientByCode(code: string): Observable<CommandeClientDto> {
    if (code) {
      return this.commandeClientService.findByCode(code);
    }
    return of({});
  }

  findAllCommandesFournisseur(): Observable<CommandeFournisseurDto[]> {
    return this.commandeFournisseurService.findAll();
  }

  findCommandeFournisseurById(id?: number): Observable<CommandeFournisseurDto> {
    if (id) {
      return this.commandeFournisseurService.findById(id);
    }
    return of({});
  }

  findCommandeFournisseurByCode(code: string): Observable<CommandeFournisseurDto> {
    if (code) {
      return this.commandeFournisseurService.findByCode(code);
    }
    return of({});
  }

  findAllLigneCommandesClient(idCmd?: number): Observable<LigneCommandeClientDto[]> {
    if (idCmd) {
      return this.commandeClientService.findAllLignesCommandesClientByCommandeClientId(idCmd);
    }
    return of();
  }

  findAllLigneCommandesFournisseur(idCmd?: number): Observable<LigneCommandeFournisseurDto[]> {
    if (idCmd) {
      return this.commandeFournisseurService.findAllLignesCommandesFournisseurByCommandeFournisseurId(idCmd);
    }
    return of();
  }

  // Signatures alignees sur le client genere gs-api (objets de parametres)
  deleteLigneCommandeClient(idCommande: number, idLigne: number): Observable<CommandeClientDto> {
    return this.commandeClientService.deleteArticle({ idCommande, idLigneCommande: idLigne });
  }

  deleteLigneCommandeFournisseur(idCommande: number, idLigne: number): Observable<CommandeFournisseurDto> {
    return this.commandeFournisseurService.deleteArticle({ idCommande, idLigneCommande: idLigne });
  }

  updateQuantiteCommandeClient(idCommande: number, idLigne: number, quantite: number): Observable<CommandeClientDto> {
    return this.commandeClientService.updateQuantiteCommande({ idCommande, idLigneCommande: idLigne, quantite });
  }

  updateQuantiteCommandeFournisseur(idCommande: number, idLigne: number, quantite: number): Observable<CommandeFournisseurDto> {
    return this.commandeFournisseurService.updateQuantiteCommande({ idCommande, idLigneCommande: idLigne, quantite });
  }

  updateArticleCommandeClient(idCommande: number, idLigne: number, idArticle: number): Observable<CommandeClientDto> {
    return this.commandeClientService.updateArticle({ idCommande, idLigneCommande: idLigne, idArticle });
  }

  updateArticleCommandeFournisseur(idCommande: number, idLigne: number, idArticle: number): Observable<CommandeFournisseurDto> {
    return this.commandeFournisseurService.updateArticle({ idCommande, idLigneCommande: idLigne, idArticle });
  }

  updateClient(idCommande: number, idClient: number): Observable<CommandeClientDto> {
    return this.commandeClientService.updateClient({ idCommande, idClient });
  }

  updateFournisseur(idCommande: number, idFournisseur: number): Observable<CommandeFournisseurDto> {
    return this.commandeFournisseurService.updateFournisseur({ idCommande, idFournisseur });
  }

  updateEtatCommandeClient(idCommande: number, etat: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE'): Observable<CommandeClientDto> {
    return this.commandeClientService.updateEtatCommande({ idCommande, etatCommande: etat });
  }

  updateEtatCommandeFournisseur(idCommande: number, etat: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE'): Observable<CommandeFournisseurDto> {
    return this.commandeFournisseurService.updateEtatCommande({ idCommande, etatCommande: etat });
  }

  deleteCommandeClient(idCommande: number): Observable<any> {
    return this.commandeClientService.delete(idCommande);
  }

  deleteCommandeFournisseur(idCommande: number): Observable<any> {
    return this.commandeFournisseurService.delete(idCommande);
  }
}
