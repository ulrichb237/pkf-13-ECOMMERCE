# Traçabilité : endpoints backend ↔ frontend Angular 21

> Audit du 17/09/2026. Le frontend doit consommer **tous** les endpoints du
> backend. Chaque endpoint est listé avec la page/composant qui le consomme.

## Bilan

| Métrique | Valeur |
|---|---|
| Endpoints backend (mappings HTTP) | **67** |
| Consommés par le frontend (directement ou via client `gs-api`) | **63** |
| Non consommés (volontairement, voir notes) | **4** |

## Article (9)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/articles` | POST | Page `nouvelarticle` (création) |
| `/api/v1/articles` | GET | Page `articles` (liste) |
| `/api/v1/articles/{idArticle}` | GET | Édition article (`nouvelarticle/:id`) |
| `/api/v1/articles/code/{codeArticle}` | GET | Autocomplete ventes/commandes + mvtstk |
| `/api/v1/articles/{idArticle}/historique-ventes` | GET | Panneau détails article + page `statistiques` |
| `/api/v1/articles/{idArticle}/historique-commandes-clients` | GET | Panneau détails article + page `statistiques` |
| `/api/v1/articles/{idArticle}/historique-commandes-fournisseurs` | GET | Panneau détails article + page `statistiques` |
| `/api/v1/categories/{idCategorie}/articles` | GET | Page `categories` → bouton Détails |
| `/api/v1/articles/{idArticle}` | DELETE | Page `articles` (suppression avec confirmation inline) |

## Authentification (1)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/authentification/connexion` | POST | Page `login` |

## Catégories (5)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/categories` | POST | Page `nouvellecategorie` |
| `/api/v1/categories` | GET | Page `categories` |
| `/api/v1/categories/{idCategorie}` | GET | Édition catégorie |
| `/api/v1/categories/{idCategorie}` | DELETE | Page `categories` (dialog de confirmation) |
| `/api/v1/categories/code/{codeCategorie}` | GET | ⚠️ Disponible dans `gs-api` mais aucune page ne l'appelle (recherche catégorie non implémentée) |

## Clients (4)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/clients` | POST | Page `nouveauclient` |
| `/api/v1/clients` | GET | Page `clients` |
| `/api/v1/clients/{idClient}` | GET | Édition client (`nouveauclient/:id`) |
| `/api/v1/clients/{idClient}` | DELETE | Carte client (confirmation inline) |

## Commandes clients (11)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/commandes-clients` | POST | Page `nouvellecommandeclt` |
| `/api/v1/commandes-clients` | GET | Page `commandesclient` |
| `/api/v1/commandes-clients/{idCommande}` | GET | ⚠️ Non consommé (le détail passe par `/lignes`) |
| `/api/v1/commandes-clients/code/{codeCommande}` | GET | ⚠️ Non consommé (recherche par code non implémentée) |
| `/api/v1/commandes-clients/{idCommande}/lignes` | GET | Accordéon page `commandesclient` |
| `/api/v1/commandes-clients/{idCommande}/etat/{etatCommande}` | PATCH | **Page `commandesclient`** — bouton « Valider » sur les commandes EN_PREPARATION, « Livrer » sur les VALIDÉES (confirmation inline, toasts) |
| `/api/v1/commandes-clients/{idCommande}/lignes/{idLigne}/quantite/{quantite}` | PATCH | Page `commandesclient` — édition de quantité inline (clic sur la quantité) |
| `/api/v1/commandes-clients/{idCommande}/client/{idClient}` | PATCH | Service applicatif — UI de réaffectation client à venir |
| `/api/v1/commandes-clients/{idCommande}/lignes/{idLigne}/article/{idArticle}` | PATCH | ⚠️ Non consommé (remplacement d'article non exposé dans l'UI) |
| `/api/v1/commandes-clients/{idCommande}/lignes/{idLigne}` | DELETE | Page `commandesclient` (suppression ligne) |
| `/api/v1/commandes-clients/{idCommande}` | DELETE | Page `commandesclient` (dialog de confirmation) |

## Commandes fournisseurs (11)

Symétrique des commandes clients : POST/GET/DELETE, **PATCH état** (workflow
Valider → Livrer) et **PATCH quantité** (édition inline) consommés par les
pages `nouvellecommandefrs` / `commandesfournisseur` ; les 2 PATCH restants
(fournisseur, article) sont câblés dans le service applicatif mais sans UI
dédiée pour le moment ; `{idCommande}` GET et `/code/{code}` non consommés.

## Workflow d'état des commandes (UI ajoutée le 17/09)

- Le bouton propose **uniquement l'état suivant** : EN_PREPARATION → VALIDEE →
  LIVREE (les transitions sont dérivées de `etatsSuivants()`).
- Une commande **LIVREE** n'affiche plus de bouton (règle backend :
  `COMMANDE_CLIENT_NON_MODIFIABLE`) ; un tag « Livrée » s'affiche à la place.
- La progression passe par une **confirmation inline** avant l'appel PATCH.
- Rappel métier : la livraison d'une commande client **génère la sortie de
  stock** côté backend ; la liste est rechargée après chaque transition.

## Entreprises (4)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/entreprises` | POST | Page `inscrire` (création entreprise + compte admin) |
| `/api/v1/entreprises` | GET | ⚠️ Disponible dans `gs-api`, pas de page d'admin entreprises |
| `/api/v1/entreprises/{idEntreprise}` | GET | ⚠️ Disponible dans `gs-api`, pas de fiche entreprise |
| `/api/v1/entreprises/{idEntreprise}` | DELETE | ⚠️ Disponible dans `gs-api`, pas d'UI de suppression (risqué volontairement) |

## Fournisseurs (4)

POST/GET/GET-by-id/DELETE consommés par les pages fournisseurs (symétrique clients).

## Mouvements de stock (6)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/mouvements-stock/articles/{idArticle}/stock-reel` | GET | Accordion page `mvtstk` (badge stock) |
| `/api/v1/mouvements-stock/articles/{idArticle}` | GET | Accordion page `mvtstk` (historique) |
| `/api/v1/mouvements-stock/entree` | POST | Formulaire mvtstk (Entree) |
| `/api/v1/mouvements-stock/sortie` | POST | Formulaire mvtstk (Sortie) |
| `/api/v1/mouvements-stock/correction-positive` | POST | Formulaire mvtstk (Correction +) |
| `/api/v1/mouvements-stock/correction-negative` | POST | Formulaire mvtstk (Correction −) |

## Photos (1)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/photos/{contexte}/{id}` | POST (multipart) | ⚠️ Endpoint non consommé : l'upload de photo utilise un aperçu local (`imgUrl`) sans envoi backend — Flickr est désactivé côté backend (placeholder) |

## Utilisateurs (6)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/utilisateurs` | POST | ⚠️ Réservé au backend (création admin à l'inscription) — pas d'UI de création manuelle |
| `/api/v1/utilisateurs` | GET | Page `utilisateurs` (liste branchée le 17/09) |
| `/api/v1/utilisateurs/{idUtilisateur}` | GET | ⚠️ Disponible dans `gs-api` (fiche utilisateur non implémentée) |
| `/api/v1/utilisateurs/email/{email}` | GET | Post-login (chargement du profil connecté) |
| `/api/v1/utilisateurs/mot-de-passe` | PATCH | Page `changermotdepasse` |
| `/api/v1/utilisateurs/{idUtilisateur}` | DELETE | ⚠️ Disponible dans `gs-api`, pas d'UI de suppression |

## Ventes (5)

| Endpoint | Méthode | Consommation frontend |
|---|---|---|
| `/api/v1/ventes` | POST | Page `nouvellevelle` |
| `/api/v1/ventes` | GET | Page `ventes` (la page `statistiques` n'utilise plus ce endpoint : les listes n'embarquent pas les lignes côté backend) |
| `/api/v1/ventes/{idVente}` | GET | Disponible dans le service applicatif (`findVenteById`) |
| `/api/v1/ventes/code/{codeVente}` | GET | Disponible dans le service applicatif (`findVenteByCode`) |
| `/api/v1/ventes/{idVente}` | DELETE | Page `ventes` (dialog de confirmation) |

## Notes

### Perf chargement (17/09)
- Pages commandes & mvtstk : les lignes/mouvements sont chargés **à l'ouverture de l'accordéon** (lazy) avec cache — plus de tempête de N requêtes au chargement.
- Page statistiques : **sélecteur d'article** (les historiques sont des endpoints par article) — 3 appels `forkJoin` à la sélection au lieu de 2×N au chargement.
- Loader global : délai 200 ms + compteur de requêtes (plus de clignotement pendant les rafales).

## Notes

- ⚠️ = disponible dans le client généré `gs-api` mais sans page qui l'appelle
  aujourd'hui. Aucun de ces endpoints n'est critique pour le flux métier
  principal (vente, commande, stock). Les plus utiles à brancher ensuite :
  recherche par code (catégories/ventes/commandes), changement d'état de
  commande (workflow VALIDEE/LIVREE), upload de photos.
- Le contrat de dates (ISO-8601 obligatoire) est documenté dans
  `MODIFICATIONS_BACKEND.md` §3.
