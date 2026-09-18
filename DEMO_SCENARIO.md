# Scénario de démonstration pas à pas

Durée totale : **12 – 15 minutes**. Backend sur `:8081`, frontend sur `:4200`.
Tout le parcours ci-dessous a été vérifié en navigateur (17/17 checks OK).

## Préparation (avant d'entrer en salle)

```bash
# 1. MySQL (docker compose du projet, si non déjà lancé)
docker compose up -d

# 2. Backend
cd backend/gestion-de-stock-api && ./mvnw spring-boot:run

# 3. Frontend (autre terminal)
cd frontend/angular/gestion-de-stock-frontend-v21 && npx ng serve --port 4200
```

Vérifications express : `http://localhost:4200` s'affiche, le badge
« Deconnexion » apparaît dans le menu après login.

**Identifiants** (détail complet dans `DEMO_CREDENTIALS.md`) :

| Compte | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@test-entreprise.com` | `Demo1234!` |
| Utilisateur standard | `claire.bernard@demo.fr` | `Demo1234!` |

---

## Séquence 1 — Inscription et mot de passe choisi (2 min)

> Montre que l'utilisateur définit lui-même son mot de passe à l'inscription.

1. Sur la page de connexion, cliquer **S'inscrire**.
2. Remplir : nom `Ma Boutique`, code fiscal `MB12345`, email `demo@boutique.fr`,
   téléphone, adresse, description.
3. En bas : **Mot de passe** `MaBoutique1!` + confirmation.
4. Cliquer **S'inscrire** → retour à la page de connexion.
5. Se connecter avec `demo@boutique.fr` / `MaBoutique1!` → **ça marche**
   (avant la modification, le mot de passe était imposé par le serveur).

*Message clé : « Chaque utilisateur choisit son mot de passe, il est chiffré
bcrypt côté backend. »*

## Séquence 2 — Mot de passe oublié (2 min)

1. Se déconnecter (bouton **Deconnexion** en bas du menu).
2. Sur la page de connexion, cliquer **Mot de passe oublie ?**.
3. Saisir `admin@test-entreprise.com` → **Recevoir un code**.
4. Le code à 6 chiffres s'affiche dans un encadre (SMTP non configuré — le
   parcours reste démontrable ; en production il partirait par email).
5. Saisir le code + nouveau mot de passe `Demo1234!` + confirmation →
   **Reinitialiser le mot de passe** → message de succès.
6. Se reconnecter avec le nouveau mot de passe.

*Message clé : « Code à durée de vie 15 minutes, usage unique, réponse
identique que l'email existe ou non (anti-énumération). »*

## Séquence 3 — Tableau de bord (3 min)

> La pièce maîtresse. Après login, vous arrivez directement dessus (`/accueil`).

1. **4 cartes KPI** calculées en temps réel depuis les données :
   - *Valeur du stock* : ≈ 285 055 € (somme stock réel × prix TTC) ;
   - *Taux de rotation* : part du stock déjà vendue ;
   - *Alertes stock bas* : **1** — badge prioritaire mis en évidence ;
   - *CA du mois* : ≈ 3 155 €, avec flèche de tendance vs mois précédent.
2. **Graphique aires** (SVG, à gauche) : entrées vs sorties sur 7 jours —
   la démo contient des entrées fournisseurs étalées sur 6 jours et une vente
   par jour, les deux courbes se superposent.
3. **Top catégories** (barres horizontales, à droite) : classement des
   catégories par quantités vendues.
4. **Derniers mouvements** : table des 10 mouvements les plus récents avec
   badges Entrée (vert) / Sortie (rouge).
5. **Alertes de seuil critique** : le *Toner laser* est à 5 unités → la carte
   apparaît avec son bouton **Reapprovisionner**. Cliquer dessus → navigue
   vers le catalogue.
6. Rafraîchir la page (F5) : montrer les **skeletons** de chargement, puis les
   données.

*Message clé : « Aucune valeur en dur — tout est calculé par des signals
Angular depuis les API. »*

## Séquence 4 — Catalogue et codes auto-générés (2 min)

1. Menu **Articles** : montrer les 10 articles, codes `ART-2026-0001…0013`
   générés automatiquement.
2. Créer un article : **Nouveau article**, désignation `Clé USB 64 Go`,
   prix HT `9.90`, catégorie *Accessoires* — **laisser le code vide**.
3. Enregistrer → le code `ART-2026-0014` a été attribué par le backend.
4. Même démonstration en 20 secondes sur **Categories** : créer `Câbles`,
   sans code → `CAT-2026-0012`.

*Message clé : « Plus de codes saisis à la main, plus d'erreurs ni de codes
non uniformes — le backend numérote en séquence par année. »*

## Séquence 5 — Workflow commande client (3 min)

1. Menu **Commandes clients** : la commande `CC-2026-0002` de Sophie Martin
   est déjà LIVRÉE.
2. Créer une commande : **Nouvelle commande**, client *Karim Dubois*,
   ajouter une ligne : *Chaise ergonomique* × 2 → enregistrer
   (le code `CC-2026-…` est auto-généré).
3. Sur la carte de la commande, faire le changement d'état :
   **EN_PREPARATION → VALIDÉE → LIVRÉE**.
4. Aller dans **Mouvements du stock** : la livraison a généré **une seule**
   sortie de −2 (la double comptabilisation création + livraison a été
   corrigée — cf. §6.2 de MODIFICATIONS_BACKEND.md).
5. Bonus si le temps le permet : bouton **Reaffecter** (changer le client de
   la commande) et **Remplacer** (échanger l'article d'une ligne).

*Message clé : « Le stock n'est compté qu'une fois, au passage à LIVRÉE. »*

## Séquence 6 — Ventes et stock temps réel (1 min)

1. Menu **Ventes** : les 7 ventes comptoir de la semaine.
2. Créer une vente : 1 × *Ecran 27 pouces* → enregistrer.
3. **Mouvements du stock** : la sortie est là, et le badge de stock de
   l'écran a baissé.

## Séquence 7 — Session sécurisée (1 min, en conclusion)

1. Attendre ou montrer le mécanisme : access token 1 h, refresh token 7 j.
2. Quand l'access token expire, l'intercepteur **renouvelle la session
   automatiquement** (invisible pour l'utilisateur) ; si le refresh est
   révoqué, retour propre au login.
3. Cliquer **Deconnexion** : le refresh token est **révoqué côté serveur**
   — la session ne peut plus être réutilisée, même si le token était copié.

*Message clé : « Sécurité de niveau production : rotation des refresh tokens,
révocation serveur, propagation systématique de l'entreprise sur chaque
écriture (multi-tenancy). »*

---

## Données prêtes pour la démo

- 10 catégories / 10 articles (codes auto, stocks réalistes, 1 article
  volontairement critique) ;
- 2 clients (Sophie Martin, Karim Dubois) + 1 fournisseur (TechDistrib) ;
- 7 ventes étalées sur 7 jours, 1 commande client livrée, 1 commande
  fournisseur en préparation ;
- 1 utilisateur standard : `claire.bernard@demo.fr` / `Demo1234!`.

## Si une question tombe

| Question | Réponse courte |
|---|---|
| Les codes sont-ils modifiables ? | Oui — si un code est fourni il est respecté, sinon il est généré. |
| Le code reçu par email ? | SMTP non configuré en démo, le code s'affiche à l'écran ; brancher un service mail = 1 appel dans `PasswordResetService`. |
| Multi-entreprise ? | Chaque écriture porte `idEntreprise` et un inspecteur SQL filtre toutes les lectures — vérifié sur articles, ventes, mouvements. |
| Tests ? | Suite E2E Playwright : 16/16 parcours auth + 17/17 navigation et dashboard, tous verts. |
