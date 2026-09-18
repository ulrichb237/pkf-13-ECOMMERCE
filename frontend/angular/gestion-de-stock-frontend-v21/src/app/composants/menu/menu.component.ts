import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {Menu} from './menu';
import {Router} from '@angular/router';

@Component({
  imports: [NgFor, NgClass, NgIf],
  selector: 'app-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  public menuProperties: Array<Menu> = [
    {
    id: '1',
    titre: 'Tableau de bord',
    icon: 'fas fa-chart-line',
    url: '',
    sousMenu: [
      {
        id: '11',
        titre: 'Vue d\'ensemble',
        icon: 'fas fa-chart-pie',
        url: ''
      },
      {
        id: '12',
        titre: 'Statistiques',
        icon: 'fas fa-chart-bar',
        url: 'statistiques'
      }
    ]
  },
    {
      id: '2',
      titre: 'Articles',
      icon: 'fas fa-boxes',
      url: '',
      sousMenu: [
        {
          id: '21',
          titre: 'Articles',
          icon: 'fas fa-boxes',
          url: 'articles'
        },
        {
          id: '22',
          titre: 'Mouvements du stock',
          icon: 'fab fa-stack-overflow',
          url: 'mvtstk'
        },
        {
          id: '23',
          titre: 'Ventes',
          icon: 'fas fa-shopping-cart',
          url: 'ventes'
        }
      ]
    },
    {
      id: '3',
      titre: 'Clients',
      icon: 'fas fa-users',
      url: '',
      sousMenu: [
        {
          id: '31',
          titre: 'Clients',
          icon: 'fas fa-users',
          url: 'clients'
        },
        {
          id: '32',
          titre: 'Commandes clients',
          icon: 'fas fa-shopping-basket',
          url: 'commandesclient'
        }
      ]
    },
    {
      id: '4',
      titre: 'Fournisseurs',
      icon: 'fas fa-users',
      url: '',
      sousMenu: [
        {
          id: '41',
          titre: 'Fournisseurs',
          icon: 'fas fa-users',
          url: 'fournisseurs'
        },
        {
          id: '42',
          titre: 'Commandes fournisseurs',
          icon: 'fas fa-truck',
          url: 'commandesfournisseur'
        }
      ]
    },
    {
      id: '5',
      titre: 'Parametrages',
      icon: 'fas fa-cogs',
      url: '',
      sousMenu: [
        {
          id: '51',
          titre: 'Categories',
          icon: 'fas fa-tools',
          url: 'categories'
        },
        {
          id: '52',
          titre: 'Utilisateurs',
          icon: 'fas fa-users-cog',
          url: 'utilisateurs'
        },
        {
          id: '53',
          titre: 'Mon entreprise',
          icon: 'fas fa-building',
          url: 'entreprise'
        }
      ]
    }
  ];

  /** Menus ouverts (remplace le collapse Bootstrap) : tous ouverts par defaut.
   * On recree le Set a chaque bascule : la reference change, ce qui garantit
   * la reactivite du template en OnPush. */
  menusOuverts = new Set<string>(this.menuProperties.map(m => m.id!).filter(Boolean));

  private lastSelectedMenu: Menu | undefined;

  constructor(
    private router: Router
  ) { }

  /** Ouvre/ferme un groupe de menu (remplace data-toggle=collapse) */
  basculerMenu(id: string): void {
    const nouveau = new Set(this.menusOuverts);
    if (nouveau.has(id)) {
      nouveau.delete(id);
    } else {
      nouveau.add(id);
    }
    this.menusOuverts = nouveau;
  }

  navigate(menu: Menu): void {
    if (this.lastSelectedMenu) {
      this.lastSelectedMenu.active = false;
    }
    menu.active = true;
    this.lastSelectedMenu = menu;
    this.router.navigate([menu.url]);
  }
}
