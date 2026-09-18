# Données de démonstration

Jeu de données réaliste pour la présentation, créé via l'API (et non en SQL direct
sauf correctifs documentés ci-dessous). L'entreprise de démo est l'entreprise 1.

## Identifiants de connexion

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur entreprise | `admin@test-entreprise.com` | `Demo1234!` |
| Utilisateur standard | `claire.bernard@demo.fr` | `Demo1234!` |

> Le mot de passe admin a été réinitialisé via le nouveau parcours
> « Mot de passe oublié » (preuve réelle que le flux forgot/reset fonctionne).
> L'utilisateur Claire a été créé via l'UI admin utilisateurs (POST /utilisateurs).

## Entreprise

- **Nom** : Ent Test MDP (créée via POST /entreprises avec `motDePasseAdmin`)
- **Email** : testmdp@demo.com — **mot de passe : `MonChoix123`** (compte de secours)

## Catalogue : 10 catégories, 10 articles

Codes auto-générés par le backend (`CodeGenerator`, format `PREFIX-YYYY-NNNN`) —
l'utilisateur n'a plus à les saisir :

| Catégorie | Articles |
|---|---|
| Informatique | Ordinateur portable Pro 14 (1078,80 € TTC), Ecran 27 pouces 4K (394,80 €) |
| Bureautique | Imprimante laser multifonction (298,80 €) |
| Mobilier | Chaise ergonomique bureau (226,80 €) |
| Électroménager | Bouilloire électrique 1.7L (47,88 €) |
| Téléphonie | Smartphone Galaxy A54 (538,80 €) |
| Papeterie | Ramette papier A4 x500 (5,40 €) |
| Périphériques | Souris sans fil comfort (29,88 €) |
| Réseaux | Switch réseau 8 ports Gigabit (70,80 €) |
| Consommables | Toner laser noir compatible (58,80 €) — **stock critique (5)** |

Stocks d'entrée : 25, 18, 12, 8, 40, 15, 100, 60, 20, 3 unités.
**Valeur totale du stock : ≈ 285 000 € TTC** (avant ventes).

## Mouvements de stock

- Entrées fournisseurs étalées sur les 6 derniers jours (alimente le graphique
  « Entrées vs sorties » du tableau de bord).
- 7 ventes comptoir (une par jour sur 7 jours) avec lignes réelles → alimente
  le CA du mois, le taux de rotation et le top catégories du dashboard.
- 1 commande client `CC-2026-0002` livrée (workflow EN_PREPARATION → LIVRÉE
  testé de bout en bout, un seul mouvement de sortie généré).
- 1 commande fournisseur `CF-2026-0001` en préparation (réception en attente,
  permet de dérouler le workflow complet pendant la démo).

## Tiers

| Rôle | Nom | Contact |
|---|---|---|
| Client | Sophie Martin | sophie.martin@client-demo.fr |
| Client | Karim Dubois | karim.dubois@client-demo.fr |
| Fournisseur | TechDistrib SA | contact@techdistrib-demo.fr |

## Correctifs appliqués pendant la préparation (documentés dans MODIFICATIONS_BACKEND.md)

1. **Entrées de stock invisibles** : `MvtStkServiceImpl` ne propagait pas
   `idEntreprise` sur les mouvements manuels → le filtre multi-entreprise les
   rendait invisibles (stock faux). Corrigé : l'entreprise de l'article lié est
   rechargée en base et appliquée au mouvement.
2. **Rétro-patch SQL** : `mvtstk.identreprise` renseigné sur les mouvements créés
   avant le correctif.
3. **Clients/fournisseurs créés par POST** n'ont pas d'entreprise (le validateur
   n'exige pas le champ) → rétro-patch SQL `identreprise = 1`.
   *Amélioration suggérée : propager l'entreprise dans `ClientServiceImpl.save`
   comme pour les articles.*

## Relancer l'environnement de démo

```bash
# Backend (port 8081)
cd backend/gestion-de-stock-api && ./mvnw spring-boot:run

# Frontend (port 4200)
cd frontend/angular/gestion-de-stock-frontend-v21 && npx ng serve

# Se connecter
# http://localhost:4200 → admin@test-entreprise.com / Demo1234!
```
