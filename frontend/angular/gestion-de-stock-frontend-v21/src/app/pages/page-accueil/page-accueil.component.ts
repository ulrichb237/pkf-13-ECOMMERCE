import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { ArticleDto } from '../../../gs-api/src/models/article-dto';
import { MvtStkDto } from '../../../gs-api/src/models/mvt-stk-dto';
import { LigneVenteDto } from '../../../gs-api/src/models/ligne-vente-dto';
import { CategoryDto } from '../../../gs-api/src/models/category-dto';

import { ArticleService } from '../../services/article/article.service';
import { MvtstkServiceApp } from '../../services/mvtstk/mvtstk.service';
import { VentesServiceApp } from '../../services/ventes/ventes.service';

interface Kpi {
  titre: string;
  valeur: string;
  detail: string;
  tendance: 'up' | 'down' | 'flat';
  critique: boolean;
  icone: 'vault' | 'cycle' | 'alerte' | 'vente';
}

interface PointMvt {
  label: string;
  entrees: number;
  sorties: number;
}

interface StockArticle {
  article: ArticleDto;
  stock: number;
  prixTtc: number;
}

/**
 * Accueil / tableau de bord (redesign) :
 * - 4 cartes KPI calculees depuis les donnees reelles (aucune valeur en dur) ;
 * - aire SVG : entrees vs sorties de stock sur les 7 derniers jours ;
 * - barres horizontales SVG : top categories par quantite vendue ;
 * - alertes de seuil critique avec action de reapprovisionnement ;
 * - derniers mouvements de stock.
 *
 * Contrainte backend respectee : lignes de vente et mouvements se lisent
 * PAR ARTICLE (historique-ventes / mouvements-stock/articles/{id}), les listes
 * globales n'embarquent pas leurs lignes.
 */
@Component({
  imports: [DatePipe],
  selector: 'app-page-accueil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-accueil.component.html',
  styleUrls: ['./page-accueil.component.scss']
})
export class PageAccueilComponent implements OnInit {

  readonly seuilCritique = 5;

  readonly chargement = signal(true);
  readonly stockParArticle = signal<Array<StockArticle>>([]);
  readonly mouvements = signal<Array<MvtStkDto>>([]);
  readonly lignesVente = signal<Array<LigneVenteDto>>([]);

  /** KPI : valeur totale du stock (somme stock reel x prix TTC) */
  readonly valeurStock = computed(() =>
    this.stockParArticle().reduce((total, s) => total + s.stock * s.prixTtc, 0)
  );

  /** KPI : alertes = articles sous le seuil critique */
  readonly alertes = computed(() =>
    this.stockParArticle().filter(s => s.stock <= this.seuilCritique)
  );

  /** KPI : chiffre d'affaires du mois en cours */
  readonly caMensuel = computed(() => {
    const maintenant = new Date();
    return this.lignesVente()
      .filter(l => this.estDansMois(l, maintenant))
      .reduce((total, l) => total + (l.prixUnitaire ?? 0) * (l.quantite ?? 0), 0);
  });

  /** KPI : taux de rotation = part vendue du total vendu + restant */
  readonly tauxRotation = computed(() => {
    const vendu = this.lignesVente().reduce((t, l) => t + (l.quantite ?? 0), 0);
    const restant = this.stockParArticle().reduce((t, s) => t + Math.max(s.stock, 0), 0);
    const total = vendu + restant;
    return total > 0 ? vendu / total : 0;
  });

  /** Tendance CA : mois courant vs mois precedent */
  readonly tendanceCa = computed<'up' | 'down' | 'flat'>(() => {
    const maintenant = new Date();
    const precedent = new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 1);
    const courant = this.caDuMois(maintenant);
    const avant = this.caDuMois(precedent);
    if (avant === 0) {
      return courant > 0 ? 'up' : 'flat';
    }
    return courant >= avant ? 'up' : 'down';
  });

  readonly kpis = computed<Array<Kpi>>(() => [
    {
      titre: 'Valeur du stock',
      valeur: this.formaterMontant(this.valeurStock()),
      detail: `${this.stockParArticle().length} references en catalogue`,
      tendance: 'flat',
      critique: false,
      icone: 'vault'
    },
    {
      titre: 'Taux de rotation',
      valeur: `${Math.round(this.tauxRotation() * 100)} %`,
      detail: 'part du stock deja vendue',
      tendance: this.tauxRotation() >= 0.5 ? 'up' : 'down',
      critique: false,
      icone: 'cycle'
    },
    {
      titre: 'Alertes stock bas',
      valeur: String(this.alertes().length),
      detail: this.alertes().length > 0 ? 'references sous le seuil' : 'aucune reference critique',
      tendance: this.alertes().length > 0 ? 'down' : 'flat',
      critique: this.alertes().length > 0,
      icone: 'alerte'
    },
    {
      titre: 'CA du mois',
      valeur: this.formaterMontant(this.caMensuel()),
      detail: 'ventes enregistrees ce mois',
      tendance: this.tendanceCa(),
      critique: false,
      icone: 'vente'
    }
  ]);

  /** Series du chart aires : 7 derniers jours */
  readonly seriesMvt = signal<Array<PointMvt>>([]);

  /** Top categories par quantite vendue (chart barres) */
  readonly topCategories = computed(() => {
    const parCategorie = new Map<string, { quantite: number; ca: number }>();
    for (const ligne of this.lignesVente()) {
      const nom = ligne.article?.category?.designation || 'Sans categorie';
      const courante = parCategorie.get(nom) ?? { quantite: 0, ca: 0 };
      courante.quantite += ligne.quantite ?? 0;
      courante.ca += (ligne.prixUnitaire ?? 0) * (ligne.quantite ?? 0);
      parCategorie.set(nom, courante);
    }
    const max = Math.max(1, ...Array.from(parCategorie.values()).map(v => v.quantite));
    return Array.from(parCategorie.entries())
      .map(([nom, v]) => ({ nom, quantite: v.quantite, ca: v.ca, pct: Math.round((v.quantite / max) * 100) }))
      .sort((a, b) => b.quantite - a.quantite)
      .slice(0, 5);
  });

  /** Derniers mouvements, du plus recent au plus ancien (10 premiers) */
  readonly derniersMouvements = computed(() =>
    [...this.mouvements()]
      .sort((a, b) => new Date(b.dateMvt as any).getTime() - new Date(a.dateMvt as any).getTime())
      .slice(0, 10)
  );

  /** Dimensions du chart SVG (viewBox) */
  readonly chartLargeur = 560;
  readonly chartHauteur = 200;

  constructor(
    private articleService: ArticleService,
    private mvtstkService: MvtstkServiceApp,
    private ventesService: VentesServiceApp,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement.set(true);
    this.articleService.findAllArticles()
      .pipe(take(1))
      .subscribe(articles => {
        const liste = articles || [];
        if (liste.length === 0) {
          this.chargement.set(false);
          return;
        }

        // Un flux combine par article : [stock, lignes de vente, mouvements]
        const flux = liste.map(article =>
          forkJoin({
            stock: this.mvtstkService.stockReelArticle(article.id).pipe(
              take(1),
              catchError(() => of(0)),
              map(v => Number(v ?? 0))
            ),
            ventes: this.ventesService.findLignesVenteArticle(article.id).pipe(
              take(1),
              catchError(() => of([])),
              map((l: any) => Array.isArray(l) ? l : [])
            ),
            mvts: this.mvtstkService.mvtStkArticle(article.id).pipe(
              take(1),
              catchError(() => of([])),
              map((m: any) => Array.isArray(m) ? m : [])
            )
          })
        );

        forkJoin(flux)
          .pipe(take(1))
          .subscribe(resultats => {
            const stocks: Array<StockArticle> = [];
            const ventes: Array<LigneVenteDto> = [];
            const mvts: Array<MvtStkDto> = [];
            resultats.forEach((r, i) => {
              const article = liste[i];
              stocks.push({
                article,
                stock: r.stock,
                prixTtc: Number(article.prixUnitaireTtc ?? 0)
              });
              ventes.push(...r.ventes);
              mvts.push(...r.mvts);
            });
            this.stockParArticle.set(stocks);
            this.lignesVente.set(ventes);
            this.mouvements.set(mvts);
            this.construireSeries();
            this.chargement.set(false);
          });
      }, () => this.chargement.set(false));
  }

  private construireSeries(): void {
    const jours: Array<PointMvt> = [];
    const aujourdhui = new Date();
    for (let i = 6; i >= 0; i--) {
      const debut = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate() - i);
      const fin = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate() - i + 1);
      const duJour = this.mouvements().filter(m => {
        if (!m.dateMvt) {
          return false;
        }
        const d = new Date(m.dateMvt as any);
        return d >= debut && d < fin;
      });
      jours.push({
        label: debut.toLocaleDateString('fr-FR', { weekday: 'short' }),
        entrees: duJour.filter(m => (m.quantite ?? 0) > 0).reduce((t, m) => t + (m.quantite ?? 0), 0),
        sorties: Math.abs(duJour.filter(m => (m.quantite ?? 0) < 0).reduce((t, m) => t + (m.quantite ?? 0), 0))
      });
    }
    this.seriesMvt.set(jours);
  }

  /** CA d'un mois donne depuis les lignes de vente datees */
  private caDuMois(mois: Date): number {
    return this.lignesVente()
      .filter(l => this.estDansMois(l, mois))
      .reduce((total, l) => total + (l.prixUnitaire ?? 0) * (l.quantite ?? 0), 0);
  }

  private estDansMois(ligne: LigneVenteDto, mois: Date): boolean {
    const date = ligne.vente?.dateVente ? new Date(ligne.vente.dateVente as any) : null;
    return !!date
      && date.getMonth() === mois.getMonth()
      && date.getFullYear() === mois.getFullYear();
  }

  /** Chemin SVG de l'aire sous la courbe */
  cheminAire(valeurs: Array<number>): string {
    const points = this.seriesMvt();
    if (points.length === 0) {
      return '';
    }
    const max = Math.max(1, ...points.map(p => Math.max(p.entrees, p.sorties)));
    const pas = this.chartLargeur / (points.length - 1 || 1);
    const coords = valeurs.map((v, i) => {
      const x = i * pas;
      const y = this.chartHauteur - (v / max) * (this.chartHauteur - 24) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M0,${this.chartHauteur} L${coords.join(' L')} L${this.chartLargeur},${this.chartHauteur} Z`;
  }

  /** Ligne superieure de l'aire (trait) */
  cheminLigne(valeurs: Array<number>): string {
    const points = this.seriesMvt();
    if (points.length === 0) {
      return '';
    }
    const max = Math.max(1, ...points.map(p => Math.max(p.entrees, p.sorties)));
    const pas = this.chartLargeur / (points.length - 1 || 1);
    return valeurs.map((v, i) => {
      const x = i * pas;
      const y = this.chartHauteur - (v / max) * (this.chartHauteur - 24) - 4;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  formaterMontant(valeur: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valeur || 0);
  }

  ouvrirArticles(): void {
    this.router.navigate(['articles']);
  }
}
