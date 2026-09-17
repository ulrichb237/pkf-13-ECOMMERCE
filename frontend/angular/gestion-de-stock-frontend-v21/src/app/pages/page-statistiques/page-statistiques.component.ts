import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ArticleService } from '../../services/article/article.service';
import { VentesServiceApp } from '../../services/ventes/ventes.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { LigneVenteDto } from '../../../gs-api/src/models/ligne-vente-dto';
import { LigneCommandeClientDto } from '../../../gs-api/src/models/ligne-commande-client-dto';
import { LigneCommandeFournisseurDto } from '../../../gs-api/src/models/ligne-commande-fournisseur-dto';

/**
 * Page statistiques : consomme les endpoints d'historique backend
 * (ventes / commandes clients / commandes fournisseurs par article)
 * ainsi que la liste des ventes.
 */
@Component({
  imports: [NgIf, NgFor, DatePipe],
  selector: 'app-page-statistiques',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-statistiques.component.html',
  styleUrls: ['./page-statistiques.component.scss']
})
export class PageStatistiquesComponent implements OnInit {

  /** Etat en signals : ecrits depuis les callbacks HTTP (zoneless-safe) */
  readonly lignesVentes = signal<Array<LigneVenteDto>>([]);
  readonly lignesCmdClient = signal<Array<LigneCommandeClientDto>>([]);
  readonly lignesCmdFournisseur = signal<Array<LigneCommandeFournisseurDto>>([]);
  readonly errorMsg = signal('');

  constructor(
    private articleService: ArticleService,
    private ventesService: VentesServiceApp
  ) { }

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.errorMsg.set('');
    this.ventesService.findAllVentes().subscribe(ventes => {
      // Aplatit toutes les lignes de vente de toutes les ventes
      this.lignesVentes.set((ventes || []).flatMap(v => v.ligneVentes || []));
    }, error => {
      this.errorMsg.set(VentesServiceApp.errorMsg(error));
    });
  }
}

/** Vente agregee pour affichage (code + total) */
interface VentesAggregees {
  code?: string;
  total?: number;
}
