import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CmdcltfrsService} from '../../services/cmdcltfrs/cmdcltfrs.service';
import {CommandeClientDto} from '../../../gs-api/src/models/commande-client-dto';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';
import { NotificationService } from '../../services/notification/notification.service';
import { Observable } from 'rxjs';

import { BouttonActionComponent } from '../../composants/boutton-action/boutton-action.component';

import { DetailCmdComponent } from '../../composants/detail-cmd/detail-cmd.component';

import { DetailCmdCltFrsComponent } from '../../composants/detail-cmd-clt-frs/detail-cmd-clt-frs.component';

import { PaginationComponent } from '../../composants/pagination/pagination.component';

/** Etats du workflow backend, dans l'ordre de progression */
type EtatCommande = 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';

@Component({
  imports: [NgIf, NgFor, DatePipe, BouttonActionComponent, DetailCmdComponent, DetailCmdCltFrsComponent, PaginationComponent],
  selector: 'app-page-cmd-clt-frs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-cmd-clt-frs.component.html',
  styleUrls: ['./page-cmd-clt-frs.component.scss']
})
export class PageCmdCltFrsComponent implements OnInit, OnDestroy {

  origin = '';
  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly listeCommandes = signal<Array<any>>([]);
  readonly errorMsg = signal('');
  readonly mapLignesCommande = signal(new Map<number, LigneCommandeClientDto[]>());
  readonly mapPrixTotalCommande = signal(new Map<number, number>());

  /** etat d'ouverture de l'accordeon par commande (reference recreee a chaque bascule) */
  readonly commandesOuvertes = signal(new Set<number>());
  /** confirmation de suppression de commande (remplace la modale Bootstrap) */
  readonly commandeASupprimer = signal<CommandeClientDto | null>(null);
  /** commande dont le menu de changement d'etat est ouvert */
  readonly commandeEtatMenuOuvert = signal<number | null>(null);
  /** changement d'etat en cours (desactive les boutons) */
  readonly changementEtatEnCours = signal(false);
  /** PATCH/DELETE de ligne en cours : idLigne -> composant detail-cmd a debloquer */
  private lignesEnCours = new Map<number, DetailCmdComponent>();
  /** derniere commande dont on a ouvert une ligne (contexte des actions ligne) */
  private dernierIdCommandeOuvert: number | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cmdCltFrsService: CmdcltfrsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data['origin'];
    });
    this.findAllCommandes();
  }

  ngOnDestroy(): void {
  }

  findAllCommandes(): void {
    this.errorMsg.set('');
    if (this.origin === 'client') {
      this.cmdCltFrsService.findAllCommandesClient()
      .subscribe(cmd => {
        this.listeCommandes.set(cmd || []);
        this.findAllLignesCommande();
      }, error => {
        this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      });
    } else if (this.origin === 'fournisseur') {
      this.cmdCltFrsService.findAllCommandesFournisseur()
      .subscribe(cmd => {
        this.listeCommandes.set(cmd || []);
        this.findAllLignesCommande();
      }, error => {
        this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      });
    }
  }

  supprimerLigneCommande(ligne: LigneCommandeClientDto): void {
    // Le backend ne renvoie pas la commande parente dans la ligne (fromEntity
    // ne la peuple pas) : on la deduit de la commande ouverte dans l'accordeon.
    const idCommande = [...this.commandesOuvertes()][0] ?? this.dernierIdCommandeOuvert;
    if (!ligne.id || !idCommande) {
      return;
    }
    if (this.origin === 'client') {
      this.cmdCltFrsService.deleteLigneCommandeClient(idCommande, ligne.id)
      .subscribe(() => this.findLignesCommande(idCommande), error => {
        this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      });
    } else if (this.origin === 'fournisseur') {
      this.cmdCltFrsService.deleteLigneCommandeFournisseur(idCommande, ligne.id!)
      .subscribe(() => this.findLignesCommande(idCommande), error => {
        this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      });
    }
  }

  /** Ouvre/ferme l'accordeon d'une commande (remplace data-toggle=collapse) */
  basculerAccordeon(idCommande?: number): void {
    if (!idCommande) {
      return;
    }
    this.dernierIdCommandeOuvert = idCommande;
    const nouveau = new Set(this.commandesOuvertes());
    if (nouveau.has(idCommande)) {
      nouveau.delete(idCommande);
    } else {
      nouveau.add(idCommande);
    }
    this.commandesOuvertes.set(nouveau);
  }

  /** La commande est-elle editable ? (regle backend : LIVREE = non modifiable) */
  estModifiable(cmd: any): boolean {
    return cmd?.etatCommande !== 'LIVREE';
  }

  /** Reference enregistree par la ligne pour la debloquer apres le PATCH */
  enregistrerRefLigne(ligneId: number | undefined, composant: DetailCmdComponent): void {
    if (ligneId) {
      this.lignesEnCours.set(ligneId, composant);
    }
  }

  /** PATCH quantite d'une ligne (clients OU fournisseurs) */
  modifierQuantiteLigne(event: { ligne: LigneCommandeClientDto; quantite: number }): void {
    const ligne = event.ligne;
    const idCommande = [...this.commandesOuvertes()][0] ?? this.dernierIdCommandeOuvert;
    if (!ligne.id || !idCommande) {
      return;
    }
    // Typage explicite : les Observable client/fournisseur ont des generiques
    // differents et leur union rend .subscribe() non appelable (TS2349)
    const requete: Observable<unknown> = this.origin === 'client'
      ? this.cmdCltFrsService.updateQuantiteCommandeClient(idCommande, ligne.id, event.quantite)
      : this.cmdCltFrsService.updateQuantiteCommandeFournisseur(idCommande, ligne.id, event.quantite);
    requete.subscribe(() => {
      this.notificationService.success('Quantite modifiee');
      this.finOperationLigne(ligne.id);
      this.findLignesCommande(idCommande);
    }, (error: any) => {
      this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      this.finOperationLigne(ligne.id);
    });
  }

  /** Debloque le composant ligne apres une operation (succes ou echec) */
  private finOperationLigne(ligneId?: number): void {
    const ref = ligneId ? this.lignesEnCours.get(ligneId) : undefined;
    ref?.finOperation();
    if (ligneId) {
      this.lignesEnCours.delete(ligneId);
    }
  }

  /** Affiche la confirmation de suppression (remplace la modale Bootstrap) */
  demanderSuppressionCommande(cmd: CommandeClientDto): void {
    this.commandeASupprimer.set(cmd);
  }

  annulerSuppressionCommande(): void {
    this.commandeASupprimer.set(null);
  }

  supprimerCommande(id?: number): void {
    if (!id) {
      return;
    }
    if (this.origin === 'client') {
      this.cmdCltFrsService.deleteCommandeClient(id)
      .subscribe(() => this.findAllCommandes(), error => {
        this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      });
    } else if (this.origin === 'fournisseur') {
      this.cmdCltFrsService.deleteCommandeFournisseur(id)
      .subscribe(() => this.findAllCommandes(), error => {
        this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      });
    }
  }

  findAllLignesCommande(): void {
    this.listeCommandes().forEach(cmd => {
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
        const nouveau = new Map(this.mapLignesCommande());
        nouveau.set(idCommande, list || []);
        this.mapLignesCommande.set(nouveau);
        this.mapPrixTotalCommande.update(m => new Map(m).set(idCommande, this.calculerTatalCmd(list || [])));
      });
    } else if (this.origin === 'fournisseur') {
      this.cmdCltFrsService.findAllLigneCommandesFournisseur(idCommande)
      .subscribe(list => {
        const nouveau = new Map(this.mapLignesCommande());
        nouveau.set(idCommande, list || []);
        this.mapLignesCommande.set(nouveau);
        this.mapPrixTotalCommande.update(m => new Map(m).set(idCommande, this.calculerTatalCmd(list || [])));
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
    return this.mapPrixTotalCommande().get(id!) ?? 0;
  }

  /* ================================================================
   * Workflow d'etat : EN_PREPARATION -> VALIDEE -> LIVREE
   * PATCH /api/v1/commandes-clients|fournisseurs/{id}/etat/{etat}
   * ================================================================ */

  /** Etats autorises pour une commande selon son etat courant.
   * Regles backend : une commande LIVREE n'est plus modifiable. */
  etatsSuivants(etatCourant?: string): EtatCommande[] {
    switch (etatCourant) {
      case 'EN_PREPARATION': return ['VALIDEE'];
      case 'VALIDEE': return ['LIVREE'];
      default: return []; // LIVREE ou etat inconnu : plus de transition
    }
  }

  ouvrirMenuEtat(idCommande: number): void {
    this.commandeEtatMenuOuvert.update(cur => cur === idCommande ? null : idCommande);
  }

  changerEtat(cmd: any, nouvelEtat: EtatCommande): void {
    if (!cmd?.id || this.changementEtatEnCours()) {
      return;
    }
    this.changementEtatEnCours.set(true);
    this.commandeEtatMenuOuvert.set(null);
    if (this.origin === 'client') {
      this.cmdCltFrsService.updateEtatCommandeClient(cmd.id, nouvelEtat)
      .subscribe(() => this.apresChangementEtat(nouvelEtat), error => {
        this.changementEtatEnCours.set(false);
        this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      });
    } else {
      this.cmdCltFrsService.updateEtatCommandeFournisseur(cmd.id, nouvelEtat)
      .subscribe(() => this.apresChangementEtat(nouvelEtat), (error: any) => {
        this.changementEtatEnCours.set(false);
        this.errorMsg.set(CmdcltfrsService.errorMsg(error));
      });
    }
  }

  private apresChangementEtat(nouvelEtat: EtatCommande): void {
    this.changementEtatEnCours.set(false);
    this.notificationService.success(`Commande ${nouvelEtat.toLowerCase().replace('_', ' ')}`);
    // Note metier backend : la livraison d'une commande client genere la
    // sortie de stock ; on rafraichit la liste complete pour reprendre
    // les etats a jour.
    this.findAllCommandes();
  }
}
