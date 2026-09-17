import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CmdcltfrsService} from '../../services/cmdcltfrs/cmdcltfrs.service';
import {CommandeClientDto} from '../../../gs-api/src/models/commande-client-dto';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';

import { BouttonActionComponent } from '../../composants/boutton-action/boutton-action.component';

import { DetailCmdComponent } from '../../composants/detail-cmd/detail-cmd.component';

import { DetailCmdCltFrsComponent } from '../../composants/detail-cmd-clt-frs/detail-cmd-clt-frs.component';

import { PaginationComponent } from '../../composants/pagination/pagination.component';

@Component({
  imports: [NgIf, NgFor, DatePipe, BouttonActionComponent, DetailCmdComponent, DetailCmdCltFrsComponent, PaginationComponent],
  selector: 'app-page-cmd-clt-frs',
  templateUrl: './page-cmd-clt-frs.component.html',
  styleUrls: ['./page-cmd-clt-frs.component.scss']
})
export class PageCmdCltFrsComponent implements OnInit, OnDestroy {

  origin = '';
  listeCommandes: Array<any> = [];
  mapLignesCommande = new Map<number, LigneCommandeClientDto[]>();
  mapPrixTotalCommande = new Map<number, number>();

  /** etat d'ouverture de l'accordeon par commande (remplace le collapse Bootstrap) */
  commandesOuvertes = new Set<number>();
  /** confirmation de suppression de commande (remplace la modale Bootstrap) */
  commandeASupprimer: CommandeClientDto | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cmdCltFrsService: CmdcltfrsService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.origin = data['origin'];
    });
    this.findAllCommandes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  errorMsg = '';

  findAllCommandes(): void {
    this.errorMsg = '';
    if (this.origin === 'client') {
      this.cmdCltFrsService.findAllCommandesClient()
      .subscribe(cmd => {
        this.listeCommandes = cmd;
        this.findAllLignesCommande();
      }, error => {
        this.errorMsg = CmdcltfrsService.errorMsg(error);
      });
    } else if (this.origin === 'fournisseur') {
      this.cmdCltFrsService.findAllCommandesFournisseur()
      .subscribe(cmd => {
        this.listeCommandes = cmd;
        this.findAllLignesCommande();
      }, error => {
        this.errorMsg = CmdcltfrsService.errorMsg(error);
      });
    }
  }

  supprimerLigneCommande(ligne: LigneCommandeClientDto): void {
    // Le backend ne renvoie pas la commande parente dans la ligne (fromEntity
    // ne la peuple pas) : on la deduit de la commande ouverte dans l'accordeon.
    const idCommande = [...this.commandesOuvertes][0];
    if (!ligne.id || !idCommande) {
      return;
    }
    if (this.origin === 'client') {
      this.cmdCltFrsService.deleteLigneCommandeClient(idCommande, ligne.id)
      .subscribe(() => this.findLignesCommande(idCommande), error => {
        this.errorMsg = CmdcltfrsService.errorMsg(error);
      });
    } else if (this.origin === 'fournisseur') {
      this.cmdCltFrsService.deleteLigneCommandeFournisseur(idCommande, ligne.id!)
      .subscribe(() => this.findLignesCommande(idCommande), error => {
        this.errorMsg = CmdcltfrsService.errorMsg(error);
      });
    }
  }

  /** Ouvre/ferme l'accordeon d'une commande (remplace data-toggle=collapse) */
  basculerAccordeon(idCommande?: number): void {
    if (!idCommande) {
      return;
    }
    if (this.commandesOuvertes.has(idCommande)) {
      this.commandesOuvertes.delete(idCommande);
    } else {
      this.commandesOuvertes.add(idCommande);
    }
  }

  /** Affiche la confirmation de suppression (remplace la modale Bootstrap) */
  demanderSuppressionCommande(cmd: CommandeClientDto): void {
    this.commandeASupprimer = cmd;
  }

  annulerSuppressionCommande(): void {
    this.commandeASupprimer = null;
  }

  supprimerCommande(id?: number): void {
    if (!id) {
      return;
    }
    if (this.origin === 'client') {
      this.cmdCltFrsService.deleteCommandeClient(id)
      .subscribe(() => this.findAllCommandes(), error => {
        this.errorMsg = CmdcltfrsService.errorMsg(error);
      });
    } else if (this.origin === 'fournisseur') {
      this.cmdCltFrsService.deleteCommandeFournisseur(id)
      .subscribe(() => this.findAllCommandes(), error => {
        this.errorMsg = CmdcltfrsService.errorMsg(error);
      });
    }
  }

  findAllLignesCommande(): void {
    this.listeCommandes.forEach(cmd => {
     this.findLignesCommande(cmd.id);
    });
  }

  nouvelleCommande(): void {
    if (this.origin === 'client') {
      this.router.navigate(['nouvellecommandeclt']);
    } else if (this.origin === 'fournisseur') {
      this.router.navigate(['nouvellecommandefrs']);
    }
  }

  findLignesCommande(idCommande?: number): void {
    if (!idCommande) {
      return;
    }
    if (this.origin === 'client') {
      this.cmdCltFrsService.findAllLigneCommandesClient(idCommande)
      .subscribe(list => {
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list));
      });
    } else if (this.origin === 'fournisseur') {
      this.cmdCltFrsService.findAllLigneCommandesFournisseur(idCommande)
      .subscribe(list => {
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list));
      });
    }
  }

  calculerTatalCmd(list: Array<LigneCommandeClientDto>): number {
    let total = 0;
    list.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite) {
        total += +ligne.quantite * +ligne.prixUnitaire;
      }
    });
    return Math.floor(total);
  }

  calculerTotalCommande(id?: number): number {
    return this.mapPrixTotalCommande.get(id!) ?? 0;
  }
}
