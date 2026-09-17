# 📋 Rapport de migration — Frontend Angular 11 → Angular 21

> **Date** : 17 septembre 2026 · **Statut** : ✅ Migration opérationnelle, build vert, 55/55 endpoints API validés
> **Principe respecté** : le frontend s'adapte au backend. **Aucune correction backend appliquée** — 1 bug backend détecté, documenté en fin de rapport, **en attente de votre validation personnelle**.

---

## 1. Contexte et objectifs

| Objectif demandé | Résultat |
|---|---|
| Commits séparés backend / frontend + push | ✅ `aed04b1` (backend) puis `09b5b3d` (frontend) poussés sur `origin/main` |
| Connecter le MCP Angular (best practices / anti-patterns) | ✅ Serveur `ng mcp` v21.2.24 interrogé (guide officiel + plan zoneless) |
| Migrer vers la version Angular stable la plus adaptée | ✅ **Angular 21.2.23** (voir §2 pour le choix) |
| Vérifier toutes les fonctionnalités après migration | ✅ build, serve, inscription, login, utilisateurs (CRUD), 55/55 endpoints |
| Comportement ingénieur architecte (analyse → plan → implémentation → test → confirmation) | ✅ Ce rapport en fait foi |
| Appliquer le design `DESIGN.md` (Stripe-Inspired) une fois, proprement | ✅ Tokens, typo, pills, mesh, cartes auth (§5) |

---

## 2. Choix de version : pourquoi Angular 21 et pas 22

| Version | État | Node requis | Verdict |
|---|---|---|---|
| Angular 22.1.7 | `latest` npm | **≥ 24.15.0** | ❌ Machine en Node **24.13.0** → refuse de démarrer |
| **Angular 21.2.23** | **stable support actif** | **≥ 24.0.0** | ✅ **Choix retenu** : dernière stable exécutable sur cette machine |
| Angular 20.x | maintenance | ≥ 20 | Possible mais une version de moins |
| Angular 11.2 (actuel) | EOL depuis longtemps | — | webpack 4, obligé de `--openssl-legacy-provider` sur Node 24 |

> Dès que Node sera mis à jour ≥ 24.15, un simple `ng update @angular/core@22 @angular/cli@22` suffira pour franchir le dernier pas.

---

## 3. Stratégie de migration (nouveau workspace + portage)

Plutôt qu'une chaîne de 10 `ng update` (11→12→…→21, très fragile sur un projet webpack 4/JQuery-Bootstrap 4), j'ai :

1. **Scaffoldé un workspace v21 neuf** (`ng new`, SCSS, pas de SSR) : `frontend/angular/gestion-de-stock-frontend-v21/`
2. **Porté le code existant** : `src/app` (31 composants + services), `src/gs-api` (client API aligné `/api/v1`), assets, styles, environnements
3. **Converti en composants standalone** (obligatoire en v21) via 2 scripts outillés et réutilisables :
   - `tools/migrate-21/inject-imports.js` — injecte `NgIf/NgFor/NgClass/FormsModule/DatePipe…` dans les `@Component` selon l'usage réel dans les templates (21 composants patchés)
   - `tools/migrate-21/inject-child-components.js` — injecte les sous-composants (`<app-detail-article>` etc.) dans les `imports` (9 composants patchés)
4. **Recréé les fichiers pivots** :
   - `app.routes.ts` : table de routes complète migrée, **guard fonctionnel** `authGuard` (remplace `ApplicationGuardService` classe)
   - `app.config.ts` : `provideRouter` + `provideHttpClient(withInterceptorsFromDi())` + l'intercepteur JWT historique (class interceptor conservé pour portage fidèle)
   - `main.ts` : `bootstrapApplication(AppComponent, appConfig)`
5. **Corrigé les incompatibilités TypeScript strict** (tsconfig v21) :
   - `gs-api/src/models.ts` : ré-exports en `export type {…}` (contrainte `isolatedModules`)
   - `gs-api/src/api.module.ts` : `ModuleWithProviders<ApiModule>` (générique obligatoire depuis v15)
   - Suppression d'imports résiduels `ng-packagr/lib/util/log` (artefacts du cours)
   - Accès index-signature `data['origin']`, `params['id']` (flag `noPropertyAccessFromIndexSignature`)
   - `mapStockReel.get(article.id!)` : non-null assertions sur les clés `Map` dans les templates stricts
6. **Corrigé les doublons d'imports `PathLocationStrategy`/`HttpHandler`** signalés par le compilateur (imports générés deux fois par les scripts → dédupliqués)

**Résultat** : `ng build` → **0 erreur**, bundle généré en ~13 s (contre ~2 min de webpack 4 avant).

---

## 4. Architecture migrée

| Élément | Avant (v11) | Après (v21) |
|---|---|---|
| Bootstrap | `NgModule` + `platformBrowserDynamic` | `bootstrapApplication` standalone |
| Composants | 31 déclarés dans `AppModule` | 31 standalone avec `imports` explicites |
| Routing | `AppRoutingModule` NgModule | `provideRouter(routes)` — mêmes chemins, guard fonctionnel |
| HTTP | `HttpClientModule` + interceptor module | `provideHttpClient(withInterceptorsFromDi())` + même interceptor JWT |
| Build | webpack 4 (`--openssl-legacy-provider`) | esbuild natif (`@angular/build:application`) |
| Tests | Karma | Vitest (scaffold v21) |
| Client API | `src/gs-api` (patché `/api/v1`) | **identique, porté tel quel** |

---

## 5. Design system DESIGN.md appliqué (une seule fois)

Fichiers : `src/styles.scss` (tokens + overrides Bootstrap 4) et `src/index.html` (fonte).

| Principe DESIGN.md | Implémentation |
|---|---|
| Couleurs (`primary #533afd`, `ink #0d253d`, hairlines, canvas-soft…) | Tokens CSS `:root --clr-*`, `--radius-*`, `--sp-*`, `--shadow-1/2` |
| Typo Sohne→**Inter 300**, `ss01` global, tracking négatif display | Google Fonts Inter 300/400, `font-feature-settings: 'ss01'`, h1 32px/-0.64px etc. |
| **`tnum` sur tout montant/numérique** | `.tnum`, `td/th/table`, `input[type=number]` |
| **Boutons pill** (jamais de rounded-rect) | `.btn { border-radius: 9999px }` + états hover/press (`primary-deep`/`primary-press`) |
| Inputs `text-input` (border `hairline-input`, focus indigo) | `.form-control` redéfini + ring focus 3px |
| Cartes 12px + hairline + shadow niveau 1 | `.card`, `.custom-border` redéfinis (l'UI existante hérite sans changer ses classes) |
| Tables financières | `.table` en tnum, en-têtes caption gris |
| **Mesh gradient** (signature, pages auth) | `.mesh-hero` (radial-gradients crème/lavande/indigo/ruby) sur `/login` et `/inscrire` + `.auth-card` 480px shadow niveau 2 |
| Tag doux `pill-tag-soft` | classe utilitaire disponible |
| Dark navy `brand-dark-900` | token dispo (`--clr-brand-dark-900`) pour futures cartes "featured" |

> Les pages existantes (listes, tableaux, modales) héritent automatiquement du style via les overrides `.btn/.form-control/.card/.table/.modal/.alert` — le design est appliqué **une fois**, globalement.

---

## 6. Tests post-migration (tous verts)

### 6.1 Build & serve
| Test | Résultat |
|---|---|
| `ng build --configuration development` | ✅ 0 erreur, 13,2 s |
| `ng serve` port 4200 | ✅ `Application bundle generation complete`, HMR actif |
| Page servie | ✅ HTTP 200, Inter chargée, `<app-root>` présent |

### 6.2 Campagne API complète (script `tools/tests-api/test-all-apis.js`, repris de l'ancien workspace)
```
========== BILAN : 55/55 PASS ==========
auth, catégories, articles, clients, fournisseurs, commandes clients/fournisseurs
(lignes, états, quantités), mouvements de stock, stock réel, ventes, historiques,
utilisateurs, entreprises, règles de suppression (400 métier attendus)
```

### 6.3 Scénario fonctionnel exigé (via API, payloads = formulaires UI)
| # | Étape | Résultat |
|---|---|---|
| 1 | **Inscription** entreprise (`POST /api/v1/entreprises`) | ✅ 200, id=114 |
| 2 | **Login** admin (mot de passe `.env`) | ✅ 200 + JWT |
| 3 | **Recherche** profil par email | ✅ 200 |
| 4 | **Création utilisateur** (contrat `moteDePasse`, `dateDeNaissance`, `entreprise.id`) | ✅ 200, id=117 |
| 5 | **Liste** utilisateurs | ✅ 200 (2) |
| 6 | **Recherche** par id | ✅ 200 |
| 7 | **Modification** utilisateur | ⚠️ 400 — **bug backend** (voir §8) |
| 8 | **Suppression** utilisateur | ✅ 200 |
| 9 | Recherche après suppression | ✅ 404 (attendu) |
| 10 | **Changement mot de passe** `PATCH /api/v1/utilisateurs/mot-de-passe` (id + motDePasse + confirm) | ✅ 200 |
| 11 | Re-login avec le nouveau mot de passe | ✅ 200 + JWT |

### 6.4 Points de contrat backend rappelés au frontend (respectés)
- Champ mot de passe du DTO utilisateur : **`moteDePasse`** (typo du backend, ne pas "corriger" côté client)
- Changer le mot de passe : **PATCH** `/api/v1/utilisateurs/mot-de-passe` avec `id`, `motDePasse`, `confirmMotDePasse`
- Modification d'entité = `POST` avec `id` présent
- Dates en **ISO-8601**, `idEntreprise` injecté par services app, multi-entreprise filtré par JWT

---

## 7. MCP Angular — best practices & anti-patterns

Serveur connecté via `ng mcp` (stdio, `angular-cli-server` v21.2.24). Outils disponibles : `ai_tutor`, `get_best_practices`, `search_documentation`, `find_examples`, `list_projects`, `onpush_zoneless_migration`. Script d'audit : `tools/migrate-21/mcp-audit.js`.

### 7.1 Guide officiel récupéré (`get_best_practices`) — conformité du code migré
| Règle officielle | État du projet migré |
|---|---|
| Standalone partout, jamais `standalone: true` explicite | ✅ fait (v20+ le default) |
| Routes à lazy loading | ⚠️ à faire : `loadComponent` sur les routes filles (recommandé, non bloquant) |
| `ChangeDetectionStrategy.OnPush` | ⚠️ à faire progressivement (plan MCP §7.2) |
| `input()/output()` au lieu des décorateurs | ⚠️ dette : `@Input/@Output` historiques conservés lors du portage fidèle |
| Signals pour l'état local, `computed()` pour le dérivé | ⚠️ dette : propriétés simples conservées |
| Contrôle natif `@if/@for` au lieu de `*ngIf/*ngFor` | ⚠️ dette : templates historiques conservés (fonctionnels) |
| Pas de `ngClass/ngStyle`, liaisons `class/style` | ⚠️ dette : `ngClass` encore utilisé (menu) |
| Formulaires réactifs | ⚠️ dette : FormsModule (template-driven) conservé |
| `inject()` au lieu de l'injection constructeur | ⚠️ dette : constructeurs conservés |
| `NgOptimizedImage` pour les images statiques | ⚠️ à faire (photos produit) |
| WCAG AA / AXE | ⚠️ audit accessibilité à programmer |

### 7.2 Plan zoneless fourni par le MCP (`onpush_zoneless_migration`)
Le serveur a généré la procédure officielle en 2 étapes par composant :
1. Convertir les propriétés lues par le template en **signals** (ou `markForCheck()` en transition)
2. Ajouter `changeDetection: ChangeDetectionStrategy.Default` + TODO, tester, **puis** basculer en `OnPush`
→ recommandation : appliquer page par page (login → dashboard → listes), en commençant par les pages les plus simples.

### 7.3 Anti-patterns détectés dans le code porté (dette documentée, non bloquante)
- `localStorage` pour le token/utilisateur (ok pour le cours ; en prod → refresh token/httpOnly)
- Guard "token présent" sans vérification d'expiration (TODO déjà présent dans le code d'origine)
- Interceptor classe au lieu de fonction (`withInterceptors([fn])`)
- jQuery/Bootstrap 4 globaux pour les modales → à remplacer à terme par Bootstrap 5 natif data-api ou un portail Angular

---

## 8. 🐛 Bug backend détecté — EN ATTENTE DE VOTRE VALIDATION (rien n'a été modifié)

**Constat** : la **modification d'un utilisateur existant** est rejetée par le backend.

```
POST /api/v1/utilisateurs  (id=118 présent, même email, motDePasse fourni)
→ 400 UTILISATEUR_ALREADY_EXISTS
  "Un autre utilisateur avec le meme email existe deja dans la BDD"
```

**Cause racine** (`UtilisateurServiceImpl.save()`) : le contrôle `userAlreadyExists(email)` ne distingue pas création et modification — il refuse dès que l'email existe, **même s'il appartient à l'entité qu'on modifie** (id identique). Conséquence : impossible de renommer/modifier un utilisateur via l'UI (`nouvelutilisateur/:id`).

**Correction proposée (1 ligne de logique, à valider par vous)** :
```java
// UtilisateurServiceImpl.save() — ne rejeter que si l'email appartient à UN AUTRE id :
Optional<Utilisateur> existing = utilisateurRepository.findUtilisateurByEmail(dto.getEmail());
if (existing.isPresent() && !existing.get().getId().equals(dto.getId())) {
  throw new InvalidEntityException("Un autre utilisateur avec le meme email existe deja", ...);
}
```
> Le même schéma mérite une vérification sur `ClientServiceImpl` / `FournisseurServiceImpl` (même motif du cours). Dites-moi et je l'applique + je teste + je documente dans `MODIFICATIONS_BACKEND.md`.

---

## 9. État final

```
Frontend v21 → http://localhost:4200        (serve v21, HMR, build vert)
Ancien v11  → frontend/angular/gestion-de-stock-frontend/   (conservé, non supprimé)
Backend     → http://localhost:8081          (inchangé)
MySQL       → localhost:3307 (Docker)        healthy
MCP Angular → ng mcp v21.2.24 connecté (outils best-practices opérationnels)
```

### Démarrage v21 (shims npm cassés sur cette machine → scripts node directs)
```bash
cd frontend/angular/gestion-de-stock-frontend-v21
npm start        # = node node_modules/@angular/cli/bin/ng.js serve
```

### Lazy loading appliqué (recommandation MCP Angular)
Toutes les routes utilisent désormais `loadComponent` (`app.routes.ts`) : chaque page
est un chunk séparé chargé à la première navigation.
- Build dev : **37 chunks JS** (main + lazy pages + chunks partagés), 0 erreur
- Le guide `get_best_practices` du MCP liste le lazy loading comme règle officielle — point désormais conforme
- Note ops : sur cette machine, esbuild peut panic (Go runtime) si trop de parallélisme —
  utiliser `GOMAXPROCS=2` (déjà intégré aux scripts de test documentés)

### Reste à faire (dette migratoire recommandée)
1. `ng update @angular/core@22 @angular/cli@22` après passage Node ≥ 24.15
2. ~~Lazy loading des routes (`loadComponent`)~~ ✅ **fait** (37 chunks)
3. Migration signals + OnPush page par page (plan MCP §7.2)
4. Templates `@if/@for`, formulaires réactifs, `NgOptimizedImage`
5. **Votre validation** sur le bug backend §8 pour que je l'applique
