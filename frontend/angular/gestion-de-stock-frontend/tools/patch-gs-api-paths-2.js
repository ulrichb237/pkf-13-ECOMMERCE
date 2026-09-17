/**
 * Patch 2 : corrige les chemins d'execution restes sur l'ancienne structure
 * (style parametres positionnels, non couverts par le patch 1 qui ciblait
 * le style ${params.xxx}).
 * Usage : node tools/patch-gs-api-paths-2.js
 */
const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '..', 'src', 'gs-api', 'src', 'services');

// Ordre important : les cas specifiques AVANT les cas generiques
const replacements = [
  // Articles
  ['/api/v1/articles/delete/${idArticle}', '/api/v1/articles/${idArticle}'],
  ['/api/v1/articles/filter/category/${idCategory}', '/api/v1/categories/${idCategory}/articles'],
  ['/api/v1/articles/filter/${codeArticle}', '/api/v1/articles/code/${codeArticle}'],
  ['/api/v1/articles/historique/vente/${idArticle}', '/api/v1/articles/${idArticle}/historique-ventes'],
  ['/api/v1/articles/historique/commandeclient/${idArticle}', '/api/v1/articles/${idArticle}/historique-commandes-clients'],
  ['/api/v1/articles/historique/commandefournisseur/${idArticle}', '/api/v1/articles/${idArticle}/historique-commandes-fournisseurs'],

  // Categories
  ['/api/v1/categories/delete/${idCategory}', '/api/v1/categories/${idCategory}'],
  ['/api/v1/categories/filter/${codeCategory}', '/api/v1/categories/code/${codeCategory}'],

  // Clients
  ['/api/v1/clients/delete/${idClient}', '/api/v1/clients/${idClient}'],

  // Entreprises
  ['/api/v1/entreprises/delete/${idEntreprise}', '/api/v1/entreprises/${idEntreprise}'],

  // Fournisseurs
  ['/api/v1/fournisseurs/delete/${idFournisseur}', '/api/v1/fournisseurs/${idFournisseur}'],

  // Utilisateurs
  ['/api/v1/utilisateurs/delete/${idUtilisateur}', '/api/v1/utilisateurs/${idUtilisateur}'],
  ['/api/v1/utilisateurs/find/${email}', '/api/v1/utilisateurs/email/${email}'],

  // Ventes (code AVANT les autres : verifier ensuite qu il ne reste rien)
  ['/api/v1/ventes/delete/${idVente}', '/api/v1/ventes/${idVente}'],
  ['/api/v1/ventes/${codeVente}', '/api/v1/ventes/code/${codeVente}'],

  // Mouvements de stock
  ['/api/v1/mvtstk/stockreel/${idArticle}', '/api/v1/mouvements-stock/articles/${idArticle}/stock-reel'],
  ['/api/v1/mvtstk/filter/article/${idArticle}', '/api/v1/mouvements-stock/articles/${idArticle}'],

  // Commandes clients (style positionnel)
  ['/api/v1/commandesclients/delete/${idCommandeClient}', '/api/v1/commandes-clients/${idCommandeClient}'],
  ['/api/v1/commandesclients/filter/${codeCommandeClient}', '/api/v1/commandes-clients/code/${codeCommandeClient}'],
  ['/api/v1/commandesclients/lignesCommande/${idCommande}', '/api/v1/commandes-clients/${idCommande}/lignes'],
  ['/api/v1/commandesclients/${idCommandeClient}', '/api/v1/commandes-clients/${idCommandeClient}'],

  // Commandes fournisseurs (style positionnel)
  ['/api/v1/commandesfournisseurs/delete/${idCommandeFournisseur}', '/api/v1/commandes-fournisseurs/${idCommandeFournisseur}'],
  ['/api/v1/commandesfournisseurs/filter/${codeCommandeFournisseur}', '/api/v1/commandes-fournisseurs/code/${codeCommandeFournisseur}'],
  ['/api/v1/commandesfournisseurs/lignesCommande/${idCommande}', '/api/v1/commandes-fournisseurs/${idCommande}/lignes'],
  ['/api/v1/commandesfournisseurs/${idCommandeFournisseur}', '/api/v1/commandes-fournisseurs/${idCommandeFournisseur}'],
];

let total = 0;
for (const file of fs.readdirSync(servicesDir).filter(f => f.endsWith('.service.ts'))) {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;
  for (const [oldStr, newStr] of replacements) {
    while (content.includes(oldStr)) {
      content = content.replace(oldStr, newStr);
      total++;
    }
  }
  if (content !== before) {
    fs.writeFileSync(filePath, content);
    console.log('Modifie :', file);
  }
}
console.log('Patch 2 termine. Remplacements :', total);
