# Modifications apportées au backend (documentation)

> **Principe** : le frontend s'aligne sur le backend. Les modifications backend
> ci-dessous sont des corrections de **bugs objectifs** (logique erronée), pas
> des adaptations aux attentes du frontend. Elles sont minimales et listées ici
> pour traçabilité.

---

## 1. `validator/AdresseValidator.java` — bug de copier-coller sur le code postal

**Fichier** : `backend/gestion-de-stock-api/src/main/java/com/k48/gestiondestock/validator/AdresseValidator.java`

### Avant (bug)
```java
if (!StringUtils.hasLength(adresseDto.getAdresse1())) {
  errors.add("Veuillez renseigner le code postal'");
}
```

### Après (corrigé)
```java
if (!StringUtils.hasLength(adresseDto.getCodePostale())) {
  errors.add("Veuillez renseigner le code postal'");
}
```

### Justification
La validation du code postal vérifiait `getAdresse1()` (copier-coller de la
validation de l'adresse 1) au lieu de `getCodePostale()`.

Conséquences du bug :
- une entreprise pouvait être enregistrée **sans code postal** (validation passée à tort) ;
- le message d'erreur « Veuillez renseigner le code postal » pouvait s'afficher
  même quand le code postal était renseigné (si l'adresse 1 était vide), ce qui
  rendait les messages d'erreur trompeurs pour l'utilisateur du frontend.

Impact fonctionnel : aucun changement de contrat d'API — le code postal devient
simplement réellement obligatoire, comme le prévoyait le message d'erreur existant.

---

## 2. Variables d'environnement locales (`.env`, non commité)

Fichier créé à la racine (copie de `.env.example`) pour le développement local.
**Aucun changement de code backend** — le backend lisait déjà ces variables via
`DotenvEnvironmentPostProcessor`. Valeurs notables :

| Variable | Valeur (dev) | Rôle |
|---|---|---|
| `DB_HOST` | `127.0.0.1` | Le handshake JDBC échouait via la résolution IPv6 de `localhost` sous Docker Desktop |
| `DB_PORT` | `3307` | Port publié par le conteneur MySQL (`MYSQL_HOST_PORT`) |
| `DB_USERNAME` | `gestionstock` | Utilisateur applicatif du conteneur (root y est refusé) |
| `JWT_SECRET` | (générée `openssl rand -base64 48`) | Signature des tokens |
| `ENTREPRISE_DEFAULT_PASSWORD` | `GwEENAsUBnfTevKN` | Mot de passe du compte admin créé à l'inscription d'une entreprise |
| `FLICKR_*` | `placeholder` | Non bloquant au démarrage (config Flickr désactivée) |

---

## 3. Contrat des dates JSON — décision d'architecture (aucun changement de code backend)

**Constat** (campagne de tests de consommation des API, voir `frontend/angular/gestion-de-stock-frontend/tools/tests-api/test-all-apis.js`) :

| Endpoint | Date envoyée en epoch **millis** (`Date.now()`) | Date envoyée en **ISO-8601** |
|---|---|---|
| `POST /api/v1/commandes-clients` / `commandes-fournisseurs` | 200 ✅ (la date est écrasée par `setDateCommande(Instant.now())` côté backend) | 200 ✅ |
| `POST /api/v1/mouvements-stock/*` | **400** ❌ (`Data truncation: Incorrect datetime value: '58681-06-24 ...'` — le nombre est interprété comme des epoch **secondes**) | 200 ✅ |
| `POST /api/v1/ventes` | **400** ❌ (même cause) | 200 ✅ |

**Cause** : Jackson (Spring Boot 4) accepte un nombre nu pour `Instant` mais le
traite comme des **secondes** epoch, pas des millisecondes. Le frontend Angular
historique envoyait `new Date().getTime()` (millis) → dates en l'an 58681 →
rejet MySQL sur les endpoints qui persistent la date du client.

**Décision (dans le sens frontend → backend)** : le frontend envoie désormais
des dates **ISO-8601** (`new Date().toISOString()`) pour tous les payloads.
Aucune modification du backend n'a été nécessaire. Fichier frontend modifié :
`src/app/composants/nouvelle-cmd-clt-frs/nouvelle-cmd-clt-frs.component.ts`.

⚠️ **À conserver comme convention projet** : toute nouvelle page frontend
envoie ses dates au format ISO-8601.

---

## Règles métier backend constatées (à respecter par le frontend — comportements normaux, non bugs)

| Règle | Comportement API |
|---|---|
| Suppression d'une entité référencée (catégorie avec articles, article dans une commande/vente, client/fournisseur avec commandes, commande avec lignes, vente avec lignes) | **400** `*_ALREADY_IN_USE` — protection volontaire, pas de suppression en cascade |
| Modification d'une commande **livrée** | **400** `COMMANDE_CLIENT_NON_MODIFIABLE` |
| État d'une commande | `EN_PREPARATION` → `VALIDEE` → `LIVREE` (la livraison génère la sortie de stock) |
| La création d'une commande client génère immédiatement une **sortie de stock** par ligne | Le stock réel diminue dès la création |
| Code des commandes/ventes | **fourni par l'appelant** (pas de génération automatique) — le frontend doit générer un code unique |
| Date d'une commande | fournie par l'appelant mais **écrasée** par le backend (`Instant.now()`) |
| Dates des mouvements de stock et ventes | **persistées telles quelles** → format ISO-8601 obligatoire |
| Filtre multi-entreprise | chaque SELECT est filtré par `identreprise` du JWT (`EntrepriseStatementInspector`) — un utilisateur ne voit que les données de son entreprise |

---

## 4. Complément de réalignement des routes du client généré (patch 2)

Le patch initial (`tools/patch-gs-api-paths.js`) ne couvrait que les chemins au
style `${params.xxx}` (méthodes avec objet de paramètres). Les méthodes à
**paramètres positionnels** (delete, findByCode, findById, lignes de commandes,
stock réel, historiques…) utilisaient un autre style (`${idCategory}`) et
restaient sur l'ancienne structure : `/delete/{id}`, `/filter/{code}`,
`/find/{email}`, `/lignesCommande/{id}`, `/stockreel/{id}`, etc.

**Correction** : `tools/patch-gs-api-paths-2.js` — 25 remplacements dans
10 services (articles, categories, clients, commandes clients/fournisseurs,
entreprises, fournisseurs, mvtstk, utilisateurs, ventes). Exemples :

| Ancien chemin (exécution) | Nouveau chemin (backend réel) |
|---|---|
| `/api/v1/categories/delete/${idCategory}` | `/api/v1/categories/${idCategory}` |
| `/api/v1/categories/filter/${codeCategory}` | `/api/v1/categories/code/${codeCategory}` |
| `/api/v1/mvtstk/stockreel/${idArticle}` | `/api/v1/mouvements-stock/articles/${idArticle}/stock-reel` |
| `/api/v1/utilisateurs/find/${email}` | `/api/v1/utilisateurs/email/${email}` |
| `/api/v1/ventes/${codeVente}` | `/api/v1/ventes/code/${codeVente}` |

Impact utilisateur direct : la **suppression de catégorie depuis la page
catégories** (et la recherche par code, le stock réel de la page mvtstk, etc.)
retournait 404 avant ce patch.

**Vérification** : plus aucun résidu après filtrage des préfixes connus du
backend ; parcours liste → création → suppression d'une catégorie validé par API.

---

## Modifications frontend correspondantes (pour mémoire)

| Fichier frontend | Changement | Motif |
|---|---|---|
| `src/gs-api/src/services/*` (95 chemins) | Réalignement des routes `/gestiondestock/v1/...` (ancien swagger du cours) vers `/api/v1/...` (backend actuel) via `tools/patch-gs-api-paths.js` | Le client généré appelait des routes inexistantes → 404 sur toutes les pages |
| `src/gs-api/src/services/utilisateurs.service.ts` | `changerMotDePasse` : POST → **PATCH** | Le backend expose `@PatchMapping(UTILISATEURS_ENDPOINT + "/mot-de-passe")` |
| `src/app/pages/page-inscription/page-inscription.component.ts` | Suppression de l'auto-login avec mot de passe codé en dur (`som3R@nd0mP@$$word`) ; redirection vers `/login` après inscription | Le mot de passe initial est **défini par le backend** (`ENTREPRISE_DEFAULT_PASSWORD`) : le frontend ne peut pas le deviner. L'utilisateur se connecte puis change son mot de passe via `/changermotdepasse` |

## Flux d'inscription résultant

1. L'utilisateur remplit le formulaire `/inscrire` (nom, code fiscal, email,
   téléphone, description, adresse 1, adresse 2, ville, code postal, pays).
2. `POST /api/v1/entreprises` crée l'entreprise **et** le compte admin
   (email = email de l'entreprise, mot de passe = `ENTREPRISE_DEFAULT_PASSWORD`).
3. Le frontend redirige vers `/login` : l'utilisateur se connecte avec son email
   et le mot de passe initial communiqué par l'administrateur.
4. Il change ensuite son mot de passe via `/changermotdepasse`
   (`PATCH /api/v1/utilisateurs/mot-de-passe`, champs `id`, `motDePasse`,
   `confirmMotDePasse` — les deux mots de passe doivent être identiques).
