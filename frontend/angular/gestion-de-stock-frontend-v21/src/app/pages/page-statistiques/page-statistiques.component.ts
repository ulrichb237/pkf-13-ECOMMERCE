import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article/article.service';
import { VentesServiceApp } from '../../services/ventes/ventes.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { ArticleDto } from '../../../gs-api/src/models/article-dto';
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
  templateUrl: './page-statistiques.component.html',
  styleUrls: ['./page-statistiques.component.scss']
})
export class PageStatistiquesComponent implements OnInit {

  listArticle: Array<ArticleDto> = [];
  ventes: Array<VentesAggregees> = [];
  lignesVentes: Array<LigneVenteDto> = [];
  lignesCmdClient: Array<LigneCommandeClientDto> = [];
  lignesCmdFournisseur: Array<LigneCommandeFournisseurDto> = [];
  errorMsg = '';

  constructor(
    private articleService: ArticleService,
    private ventesService: VentesServiceApp,
    private cmdCltFrsService: CmdcltfrsService
  ) { }

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.errorMsg = '';
    this.ventesService.findAllVentes().subscribe(ventes => {
      // Aplatit toutes les lignes de vente de toutes les ventes
      this.lignesVentes = (ventes || []).flatMap(v => v.ligneVentes || []);
    }, error => {
      this.errorMsg = VentesServiceApp.errorMsg(error);
    });
  }

  voirHistoriqueArticle(article: ArticleDto): void {
    if (!article.id) {
      return;
    }
    this.articleService.findHistoriqueVentes(article.id)
      .subscribe(lignes => this.lignesVentes = lignes || []);
    this.articleService.findHistoriqueCommandeClient(article.id)
      .subscribe(lignes => this.lignesCmdClient = lignes || []);
    this.articleService.findHistoriqueCommandeFournisseur(article.id)
      .subscribe(lignes => this.lignesCmdFournisseur = lignes || []);
  }
}

/** Vente agregee pour affichage (code + total) */
interface VentesAggregees {
  code?: string;
  total?: number;
}
