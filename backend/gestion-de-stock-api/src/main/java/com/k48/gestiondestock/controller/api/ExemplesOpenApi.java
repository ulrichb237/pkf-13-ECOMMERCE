package com.k48.gestiondestock.controller.api;

/**
 * Corps de requete proposes par Swagger UI ("Try it out") pour les creations.
 * Sans ces exemples, Swagger UI envoie "id": 0, ce qui declenche une modification d'un objet inexistant.
 * Les objets lies (categorie, client, article...) ne sont references que par leur identifiant.
 */
public interface ExemplesOpenApi {

  String CREATION = "Création";

  String AIDE_MODIFICATION = "Pour une création, ne pas envoyer le champ `id`. "
      + "Pour une modification, ajouter le champ `id` de l'objet existant.";

  String ADRESSE = """
      {"adresse1": "12 rue des Palmiers", "adresse2": "Bâtiment B", "ville": "Douala", "codePostale": "00237", "pays": "Cameroun"}""";

  String ENTREPRISE = """
      {
        "nom": "K48 Distribution",
        "description": "Distribution de matériel informatique",
        "codeFiscal": "M012345678901A",
        "email": "contact@k48.com",
        "numTel": "+237 690 00 00 00",
        "steWeb": "https://www.k48.com",
        "adresse": """ + ADRESSE + """
      }""";

  String UTILISATEUR = """
      {
        "nom": "Nono",
        "prenom": "Leonel",
        "email": "leonel@k48.com",
        "dateDeNaissance": "1995-05-20T00:00:00Z",
        "moteDePasse": "M0t-De-Passe",
        "adresse": """ + ADRESSE + """
      ,
        "entreprise": {"id": 1}
      }""";

  String CATEGORIE = """
      {
        "code": "CAT-INFO",
        "designation": "Informatique",
        "idEntreprise": 1
      }""";

  String ARTICLE = """
      {
        "codeArticle": "ART-001",
        "designation": "Clavier sans fil",
        "prixUnitaireHt": 10000,
        "tauxTva": 19.25,
        "prixUnitaireTtc": 11925,
        "category": {"id": 1},
        "idEntreprise": 1
      }""";

  String CLIENT = """
      {
        "nom": "Ngono",
        "prenom": "Marie",
        "mail": "marie.ngono@example.com",
        "numTel": "+237 690 00 00 01",
        "adresse": """ + ADRESSE + """
      ,
        "idEntreprise": 1
      }""";

  String FOURNISSEUR = """
      {
        "nom": "Tchoumi",
        "prenom": "Paul",
        "mail": "paul.tchoumi@example.com",
        "numTel": "+237 677 00 00 00",
        "adresse": """ + ADRESSE + """
      ,
        "idEntreprise": 1
      }""";

  String COMMANDE_CLIENT = """
      {
        "code": "CC-2026-001",
        "dateCommande": "2026-09-16T10:00:00Z",
        "etatCommande": "EN_PREPARATION",
        "client": {"id": 1},
        "idEntreprise": 1,
        "ligneCommandeClients": [
          {"article": {"id": 1}, "quantite": 2, "prixUnitaire": 11925, "idEntreprise": 1}
        ]
      }""";

  String COMMANDE_FOURNISSEUR = """
      {
        "code": "CF-2026-001",
        "dateCommande": "2026-09-16T10:00:00Z",
        "etatCommande": "EN_PREPARATION",
        "fournisseur": {"id": 1},
        "idEntreprise": 1,
        "ligneCommandeFournisseurs": [
          {"article": {"id": 1}, "quantite": 10, "prixUnitaire": 8000, "idEntreprise": 1}
        ]
      }""";

  String VENTE = """
      {
        "code": "V-2026-001",
        "dateVente": "2026-09-16T10:00:00Z",
        "commentaire": "Vente comptoir",
        "idEntreprise": 1,
        "ligneVentes": [
          {"article": {"id": 1}, "quantite": 1, "prixUnitaire": 11925, "idEntreprise": 1}
        ]
      }""";

  String MOUVEMENT_STOCK = """
      {
        "dateMvt": "2026-09-16T10:00:00Z",
        "quantite": 10,
        "article": {"id": 1},
        "typeMvt": "ENTREE",
        "sourceMvt": "COMMANDE_FOURNISSEUR",
        "idEntreprise": 1
      }""";
}
