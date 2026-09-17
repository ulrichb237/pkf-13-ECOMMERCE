import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageStatistiquesComponent } from './pages/page-statistiques/page-statistiques.component';
import { PageArticleComponent } from './pages/articles/page-article/page-article.component';
import { NouvelArticleComponent } from './pages/articles/nouvel-article/nouvel-article.component';
import { PageMvtstkComponent } from './pages/mvtstk/page-mvtstk/page-mvtstk.component';
import { PageVentesComponent } from './pages/ventes/page-ventes/page-ventes.component';
import { NouvelleVenteComponent } from './pages/ventes/nouvelle-vente/nouvelle-vente.component';
import { PageClientComponent } from './pages/client/page-client/page-client.component';
import { PageFournisseurComponent } from './pages/fournisseur/page-fournisseur/page-fournisseur.component';
import { NouveauCltFrsComponent } from './composants/nouveau-clt-frs/nouveau-clt-frs.component';
import { PageCmdCltFrsComponent } from './pages/page-cmd-clt-frs/page-cmd-clt-frs.component';
import { NouvelleCmdCltFrsComponent } from './composants/nouvelle-cmd-clt-frs/nouvelle-cmd-clt-frs.component';
import { PageCategoriesComponent } from './pages/categories/page-categories/page-categories.component';
import { NoouvelleCategoryComponent } from './pages/categories/noouvelle-category/noouvelle-category.component';
import { PageUtilisateurComponent } from './pages/utilisateur/page-utilisateur/page-utilisateur.component';
import { NouvelUtilisateurComponent } from './pages/utilisateur/nouvel-utilisateur/nouvel-utilisateur.component';
import { PageProfilComponent } from './pages/profil/page-profil/page-profil.component';
import { ChangerMotDePasseComponent } from './pages/profil/changer-mot-de-passe/changer-mot-de-passe.component';

/**
 * Guard fonctionnel (best practice Angular >= 15) : remplace
 * l'ancien ApplicationGuardService (classe CanActivate).
 */
export const authGuard = (): boolean | ReturnType<Router['parseUrl']> => {
  const router = inject(Router);
  if (localStorage.getItem('accessToken')) {
    return true;
  }
  return router.parseUrl('/login');
};

export const routes: Routes = [
  {
    path: 'login',
    component: PageLoginComponent
  },
  {
    path: 'inscrire',
    component: PageInscriptionComponent
  },
  {
    path: '',
    component: PageDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'statistiques', component: PageStatistiquesComponent, canActivate: [authGuard] },
      { path: 'articles', component: PageArticleComponent, canActivate: [authGuard] },
      { path: 'nouvelarticle', component: NouvelArticleComponent, canActivate: [authGuard] },
      { path: 'nouvelarticle/:idArticle', component: NouvelArticleComponent, canActivate: [authGuard] },
      { path: 'mvtstk', component: PageMvtstkComponent, canActivate: [authGuard] },
      { path: 'ventes', component: PageVentesComponent, canActivate: [authGuard] },
      { path: 'nouvellevelle', component: NouvelleVenteComponent, canActivate: [authGuard] },
      {
        path: 'clients', component: PageClientComponent, canActivate: [authGuard]
      },
      { path: 'nouveauclient', component: NouveauCltFrsComponent, canActivate: [authGuard], data: { origin: 'client' } },
      { path: 'nouveauclient/:id', component: NouveauCltFrsComponent, canActivate: [authGuard], data: { origin: 'client' } },
      { path: 'commandesclient', component: PageCmdCltFrsComponent, canActivate: [authGuard], data: { origin: 'client' } },
      { path: 'nouvellecommandeclt', component: NouvelleCmdCltFrsComponent, canActivate: [authGuard], data: { origin: 'client' } },
      { path: 'fournisseurs', component: PageFournisseurComponent, canActivate: [authGuard] },
      { path: 'nouveaufournisseur', component: NouveauCltFrsComponent, canActivate: [authGuard], data: { origin: 'fournisseur' } },
      { path: 'nouveaufournisseur/:id', component: NouveauCltFrsComponent, canActivate: [authGuard], data: { origin: 'fournisseur' } },
      { path: 'commandesfournisseur', component: PageCmdCltFrsComponent, canActivate: [authGuard], data: { origin: 'fournisseur' } },
      { path: 'nouvellecommandefrs', component: NouvelleCmdCltFrsComponent, canActivate: [authGuard], data: { origin: 'fournisseur' } },
      { path: 'categories', component: PageCategoriesComponent, canActivate: [authGuard] },
      { path: 'nouvellecategorie', component: NoouvelleCategoryComponent, canActivate: [authGuard] },
      { path: 'nouvellecategorie/:idCategory', component: NoouvelleCategoryComponent, canActivate: [authGuard] },
      { path: 'utilisateurs', component: PageUtilisateurComponent, canActivate: [authGuard] },
      { path: 'nouvelutilisateur', component: NouvelUtilisateurComponent, canActivate: [authGuard] },
      { path: 'profil', component: PageProfilComponent, canActivate: [authGuard] },
      { path: 'changermotdepasse', component: ChangerMotDePasseComponent, canActivate: [authGuard] }
    ]
  }
];
