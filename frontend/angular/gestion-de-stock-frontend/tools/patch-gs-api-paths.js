/**
 * Réaligne le client généré (src/gs-api) sur les routes réelles du backend.
 * Usage : node tools/patch-gs-api-paths.js
 * Le client généré provient d'un ancien swagger (/gestiondestock/v1/...) :
 * ce script remplace les chemins par ceux du backend actuel (/api/v1/...).
 */
const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '..', 'src', 'gs-api', 'src', 'services');

// Ordre important : les cas spécifiques AVANT les cas generiques.
const replacements = [
  // Authentification
  ['/api/v1/auth/authenticate', '/api/v1/authentification/connexion'],

  // Articles
  ['/api/v1/articles/all', '/api/v1/articles'],
  ['/api/v1/articles/create', '/api/v1/articles'],
  ['/api/v1/articles/delete/${params.idArticle}', '/api/v1/articles/${params.idArticle}'],
  ['/api/v1/articles/filter/category/${params.idCategory}', '/api/v1/categories/${params.idCategory}/articles'],
  ['/api/v1/articles/filter/${params.codeArticle}', '/api/v1/articles/code/${params.codeArticle}'],
  ['/api/v1/articles/historique/vente/${params.idArticle}', '/api/v1/articles/${params.idArticle}/historique-ventes'],
  ['/api/v1/articles/historique/commandeclient/${params.idArticle}', '/api/v1/articles/${params.idArticle}/historique-commandes-clients'],
  ['/api/v1/articles/historique/commandefournisseur/${params.idArticle}', '/api/v1/articles/${params.idArticle}/historique-commandes-fournisseurs'],

  // Categories
  ['/api/v1/categories/all', '/api/v1/categories'],
  ['/api/v1/categories/create', '/api/v1/categories'],
  ['/api/v1/categories/delete/${params.idCategory}', '/api/v1/categories/${params.idCategory}'],
  ['/api/v1/categories/filter/${params.codeCategory}', '/api/v1/categories/code/${params.codeCategory}'],

  // Clients
  ['/api/v1/clients/all', '/api/v1/clients'],
  ['/api/v1/clients/create', '/api/v1/clients'],
  ['/api/v1/clients/delete/${params.idClient}', '/api/v1/clients/${params.idClient}'],

  // Entreprises
  ['/api/v1/entreprises/all', '/api/v1/entreprises'],
  ['/api/v1/entreprises/create', '/api/v1/entreprises'],
  ['/api/v1/entreprises/delete/${params.idEntreprise}', '/api/v1/entreprises/${params.idEntreprise}'],

  // Fournisseurs
  ['/api/v1/fournisseurs/all', '/api/v1/fournisseurs'],
  ['/api/v1/fournisseurs/create', '/api/v1/fournisseurs'],
  ['/api/v1/fournisseurs/delete/${params.idFournisseur}', '/api/v1/fournisseurs/${params.idFournisseur}'],

  // Utilisateurs
  ['/api/v1/utilisateurs/all', '/api/v1/utilisateurs'],
  ['/api/v1/utilisateurs/create', '/api/v1/utilisateurs'],
  ['/api/v1/utilisateurs/delete/${params.idUtilisateur}', '/api/v1/utilisateurs/${params.idUtilisateur}'],
  ['/api/v1/utilisateurs/find/${params.email}', '/api/v1/utilisateurs/email/${params.email}'],
  ['/api/v1/utilisateurs/update/password', '/api/v1/utilisateurs/mot-de-passe'],

  // Ventes (code AVANT id : les deux templates coexistent)
  ['/api/v1/ventes/all', '/api/v1/ventes'],
  ['/api/v1/ventes/create', '/api/v1/ventes'],
  ['/api/v1/ventes/${params.codeVente}', '/api/v1/ventes/code/${params.codeVente}'],
  ['/api/v1/ventes/delete/${params.idVente}', '/api/v1/ventes/${params.idVente}'],

  // Mouvements de stock
  ['/api/v1/mvtstk/entree', '/api/v1/mouvements-stock/entree'],
  ['/api/v1/mvtstk/sortie', '/api/v1/mouvements-stock/sortie'],
  ['/api/v1/mvtstk/correctionpos', '/api/v1/mouvements-stock/correction-positive'],
  ['/api/v1/mvtstk/correctionneg', '/api/v1/mouvements-stock/correction-negative'],
  ['/api/v1/mvtstk/stockreel/${params.idArticle}', '/api/v1/mouvements-stock/articles/${params.idArticle}/stock-reel'],
  ['/api/v1/mvtstk/filter/article/${params.idArticle}', '/api/v1/mouvements-stock/articles/${params.idArticle}'],

  // Photos : ancien /save/{id}/{title}/{context} -> /photos/{contexte}/{id}
  ['/api/v1/save/${params.id}/${params.title}/${params.context}', '/api/v1/photos/${params.context}/${params.id}'],

  // Commandes clients
  ['/api/v1/commandesclients/all', '/api/v1/commandes-clients'],
  ['/api/v1/commandesclients/create', '/api/v1/commandes-clients'],
  ['/api/v1/commandesclients/filter/${params.codeCommandeClient}', '/api/v1/commandes-clients/code/${params.codeCommandeClient}'],
  ['/api/v1/commandesclients/lignesCommande/${params.idCommande}', '/api/v1/commandes-clients/${params.idCommande}/lignes'],
  ['/api/v1/commandesclients/update/etat/${params.idCommande}/${params.etatCommande}', '/api/v1/commandes-clients/${params.idCommande}/etat/${params.etatCommande}'],
  ['/api/v1/commandesclients/update/quantite/${params.idCommande}/${params.idLigneCommande}/${params.quantite}', '/api/v1/commandes-clients/${params.idCommande}/lignes/${params.idLigneCommande}/quantite/${params.quantite}'],
  ['/api/v1/commandesclients/update/client/${params.idCommande}/${params.idClient}', '/api/v1/commandes-clients/${params.idCommande}/client/${params.idClient}'],
  ['/api/v1/commandesclients/update/article/${params.idCommande}/${params.idLigneCommande}/${params.idArticle}', '/api/v1/commandes-clients/${params.idCommande}/lignes/${params.idLigneCommande}/article/${params.idArticle}'],
  ['/api/v1/commandesclients/delete/article/${params.idCommande}/${params.idLigneCommande}', '/api/v1/commandes-clients/${params.idCommande}/lignes/${params.idLigneCommande}'],
  ['/api/v1/commandesclients/delete/${params.idCommandeClient}', '/api/v1/commandes-clients/${params.idCommandeClient}'],
  ['/api/v1/commandesclients/${params.idCommandeClient}', '/api/v1/commandes-clients/${params.idCommandeClient}'],

  // Commandes fournisseurs
  ['/api/v1/commandesfournisseurs/all', '/api/v1/commandes-fournisseurs'],
  ['/api/v1/commandesfournisseurs/create', '/api/v1/commandes-fournisseurs'],
  ['/api/v1/commandesfournisseurs/filter/${params.codeCommandeFournisseur}', '/api/v1/commandes-fournisseurs/code/${params.codeCommandeFournisseur}'],
  ['/api/v1/commandesfournisseurs/lignesCommande/${params.idCommande}', '/api/v1/commandes-fournisseurs/${params.idCommande}/lignes'],
  ['/api/v1/commandesfournisseurs/update/etat/${params.idCommande}/${params.etatCommande}', '/api/v1/commandes-fournisseurs/${params.idCommande}/etat/${params.etatCommande}'],
  ['/api/v1/commandesfournisseurs/update/quantite/${params.idCommande}/${params.idLigneCommande}/${params.quantite}', '/api/v1/commandes-fournisseurs/${params.idCommande}/lignes/${params.idLigneCommande}/quantite/${params.quantite}'],
  ['/api/v1/commandesfournisseurs/update/fournisseur/${params.idCommande}/${params.idFournisseur}', '/api/v1/commandes-fournisseurs/${params.idCommande}/fournisseur/${params.idFournisseur}'],
  ['/api/v1/commandesfournisseurs/update/article/${params.idCommande}/${params.idLigneCommande}/${params.idArticle}', '/api/v1/commandes-fournisseurs/${params.idCommande}/lignes/${params.idLigneCommande}/article/${params.idArticle}'],
  ['/api/v1/commandesfournisseurs/delete/article/${params.idCommande}/${params.idLigneCommande}', '/api/v1/commandes-fournisseurs/${params.idCommande}/lignes/${params.idLigneCommande}'],
  ['/api/v1/commandesfournisseurs/delete/${params.idCommandeFournisseur}', '/api/v1/commandes-fournisseurs/${params.idCommandeFournisseur}'],
  ['/api/v1/commandesfournisseurs/${params.idCommandeFournisseur}', '/api/v1/commandes-fournisseurs/${params.idCommandeFournisseur}'],
];

// Declarations statiques (documentation) : formes avec accolades {id}
const braceReplacements = [
  ['/api/v1/articles/delete/{idArticle}', '/api/v1/articles/{idArticle}'],
  ['/api/v1/articles/filter/category/{idCategory}', '/api/v1/categories/{idCategory}/articles'],
  ['/api/v1/articles/filter/{codeArticle}', '/api/v1/articles/code/{codeArticle}'],
  ['/api/v1/articles/historique/vente/{idArticle}', '/api/v1/articles/{idArticle}/historique-ventes'],
  ['/api/v1/articles/historique/commandeclient/{idArticle}', '/api/v1/articles/{idArticle}/historique-commandes-clients'],
  ['/api/v1/articles/historique/commandefournisseur/{idArticle}', '/api/v1/articles/{idArticle}/historique-commandes-fournisseurs'],
  ['/api/v1/categories/all', '/api/v1/categories'],
  ['/api/v1/categories/create', '/api/v1/categories'],
  ['/api/v1/categories/delete/{idCategory}', '/api/v1/categories/{idCategory}'],
  ['/api/v1/categories/filter/{codeCategory}', '/api/v1/categories/code/{codeCategory}'],
  ['/api/v1/clients/all', '/api/v1/clients'],
  ['/api/v1/clients/create', '/api/v1/clients'],
  ['/api/v1/clients/delete/{idClient}', '/api/v1/clients/{idClient}'],
  ['/api/v1/entreprises/all', '/api/v1/entreprises'],
  ['/api/v1/entreprises/create', '/api/v1/entreprises'],
  ['/api/v1/entreprises/delete/{idEntreprise}', '/api/v1/entreprises/{idEntreprise}'],
  ['/api/v1/fournisseurs/all', '/api/v1/fournisseurs'],
  ['/api/v1/fournisseurs/create', '/api/v1/fournisseurs'],
  ['/api/v1/fournisseurs/delete/{idFournisseur}', '/api/v1/fournisseurs/{idFournisseur}'],
  ['/api/v1/utilisateurs/all', '/api/v1/utilisateurs'],
  ['/api/v1/utilisateurs/create', '/api/v1/utilisateurs'],
  ['/api/v1/utilisateurs/delete/{idUtilisateur}', '/api/v1/utilisateurs/{idUtilisateur}'],
  ['/api/v1/utilisateurs/find/{email}', '/api/v1/utilisateurs/email/{email}'],
  ['/api/v1/utilisateurs/update/password', '/api/v1/utilisateurs/mot-de-passe'],
  ['/api/v1/ventes/all', '/api/v1/ventes'],
  ['/api/v1/ventes/create', '/api/v1/ventes'],
  ['/api/v1/ventes/{codeVente}', '/api/v1/ventes/code/{codeVente}'],
  ['/api/v1/ventes/delete/{idVente}', '/api/v1/ventes/{idVente}'],
  ['/api/v1/mvtstk/entree', '/api/v1/mouvements-stock/entree'],
  ['/api/v1/mvtstk/sortie', '/api/v1/mouvements-stock/sortie'],
  ['/api/v1/mvtstk/correctionpos', '/api/v1/mouvements-stock/correction-positive'],
  ['/api/v1/mvtstk/correctionneg', '/api/v1/mouvements-stock/correction-negative'],
  ['/api/v1/mvtstk/stockreel/{idArticle}', '/api/v1/mouvements-stock/articles/{idArticle}/stock-reel'],
  ['/api/v1/mvtstk/filter/article/{idArticle}', '/api/v1/mouvements-stock/articles/{idArticle}'],
  ['/api/v1/save/{id}/{title}/{context}', '/api/v1/photos/{context}/{id}'],
  ['/api/v1/commandesclients/all', '/api/v1/commandes-clients'],
  ['/api/v1/commandesclients/create', '/api/v1/commandes-clients'],
  ['/api/v1/commandesclients/filter/{codeCommandeClient}', '/api/v1/commandes-clients/code/{codeCommandeClient}'],
  ['/api/v1/commandesclients/lignesCommande/{idCommande}', '/api/v1/commandes-clients/{idCommande}/lignes'],
  ['/api/v1/commandesclients/update/etat/{idCommande}/{etatCommande}', '/api/v1/commandes-clients/{idCommande}/etat/{etatCommande}'],
  ['/api/v1/commandesclients/update/quantite/{idCommande}/{idLigneCommande}/{quantite}', '/api/v1/commandes-clients/{idCommande}/lignes/{idLigneCommande}/quantite/{quantite}'],
  ['/api/v1/commandesclients/update/client/{idCommande}/{idClient}', '/api/v1/commandes-clients/{idCommande}/client/{idClient}'],
  ['/api/v1/commandesclients/update/article/{idCommande}/{idLigneCommande}/{idArticle}', '/api/v1/commandes-clients/{idCommande}/lignes/{idLigneCommande}/article/{idArticle}'],
  ['/api/v1/commandesclients/delete/article/{idCommande}/{idLigneCommande}', '/api/v1/commandes-clients/{idCommande}/lignes/{idLigneCommande}'],
  ['/api/v1/commandesclients/delete/{idCommandeClient}', '/api/v1/commandes-clients/{idCommandeClient}'],
  ['/api/v1/commandesclients/{idCommandeClient}', '/api/v1/commandes-clients/{idCommandeClient}'],
  ['/api/v1/commandesfournisseurs/all', '/api/v1/commandes-fournisseurs'],
  ['/api/v1/commandesfournisseurs/create', '/api/v1/commandes-fournisseurs'],
  ['/api/v1/commandesfournisseurs/filter/{codeCommandeFournisseur}', '/api/v1/commandes-fournisseurs/code/{codeCommandeFournisseur}'],
  ['/api/v1/commandesfournisseurs/lignesCommande/{idCommande}', '/api/v1/commandes-fournisseurs/{idCommande}/lignes'],
  ['/api/v1/commandesfournisseurs/update/etat/{idCommande}/{etatCommande}', '/api/v1/commandes-fournisseurs/{idCommande}/etat/{etatCommande}'],
  ['/api/v1/commandesfournisseurs/update/quantite/{idCommande}/{idLigneCommande}/{quantite}', '/api/v1/commandes-fournisseurs/{idCommande}/lignes/{idLigneCommande}/quantite/{quantite}'],
  ['/api/v1/commandesfournisseurs/update/fournisseur/{idCommande}/{idFournisseur}', '/api/v1/commandes-fournisseurs/{idCommande}/fournisseur/{idFournisseur}'],
  ['/api/v1/commandesfournisseurs/update/article/{idCommande}/{idLigneCommande}/{idArticle}', '/api/v1/commandes-fournisseurs/{idCommande}/lignes/{idLigneCommande}/article/{idArticle}'],
  ['/api/v1/commandesfournisseurs/delete/article/{idCommande}/{idLigneCommande}', '/api/v1/commandes-fournisseurs/{idCommande}/lignes/{idLigneCommande}'],
  ['/api/v1/commandesfournisseurs/delete/{idCommandeFournisseur}', '/api/v1/commandes-fournisseurs/{idCommandeFournisseur}'],
  ['/api/v1/commandesfournisseurs/{idCommandeFournisseur}', '/api/v1/commandes-fournisseurs/{idCommandeFournisseur}'],
];

let totalChanges = 0;
for (const file of fs.readdirSync(servicesDir).filter(f => f.endsWith('.service.ts'))) {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  // 1) prefixe global  /gestiondestock/v1 -> /api/v1
  const before = content;
  content = content.split('/gestiondestock/v1').join('/api/v1');
  // 2) cas specifiques (templates d'execution)
  for (const [oldStr, newStr] of replacements) {
    while (content.includes(oldStr)) {
      content = content.replace(oldStr, newStr);
      totalChanges++;
    }
  }
  // 2bis) declarations statiques (formes avec accolades)
  for (const [oldStr, newStr] of braceReplacements) {
    while (content.includes(oldStr)) {
      content = content.replace(oldStr, newStr);
      totalChanges++;
    }
  }
  // 3) changerMotDePasse : POST -> PATCH
  if (file === 'utilisateurs.service.ts') {
    content = content.replace(
      /new HttpRequest<any>\(\s*'POST',\s*this\.rootUrl \+ `\/api\/v1\/utilisateurs\/mot-de-passe`/,
      "new HttpRequest<any>(\n      'PATCH',\n      this.rootUrl + `/api/v1/utilisateurs/mot-de-passe`"
    );
  }
  if (content !== before || totalChanges > 0) {
    fs.writeFileSync(filePath, content);
  }
}
console.log('Patch termine. Remplacements specifiques :', totalChanges);
