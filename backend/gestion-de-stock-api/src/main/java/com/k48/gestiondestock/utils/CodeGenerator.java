package com.k48.gestiondestock.utils;

import com.k48.gestiondestock.dto.ArticleDto;
import com.k48.gestiondestock.dto.CategoryDto;
import com.k48.gestiondestock.dto.CommandeClientDto;
import com.k48.gestiondestock.dto.CommandeFournisseurDto;
import com.k48.gestiondestock.dto.VentesDto;
import java.time.Year;

/**
 * Genere les codes metier auto-remplis par le backend quand le client n'en
 * fournit pas : plus d'erreurs utilisateur, plus de codes non uniformes.
 *
 * Format : PREFIX-ANNEE-SEQ (seq sur 4 chiffres), ex. ART-2026-0001.
 * Le sequenceur est deduit du plus grand code existant du prefixe, donc
 * stable apres import de donnees ou restauration de sauvegarde.
 */
public final class CodeGenerator {

  private static final String SEPARATEUR = "-";
  private static final int LONGUEUR_SEQ = 4;

  private CodeGenerator() {
  }

  /** Article : ART-2026-0001 (si le client fournit ART-001, pas de surcharge) */
  public static String nextArticleCode(String dernierCode) {
    return prochain("ART", dernierCode);
  }

  /** Categorie : CAT-2026-0001 */
  public static String nextCategoryCode(String dernierCode) {
    return prochain("CAT", dernierCode);
  }

  /** Vente : VEN-2026-0001 (compatible codes "V-..." historiques) */
  public static String nextVenteCode(String dernierCode) {
    return prochain("VEN", dernierCode);
  }

  /** Commande client : CC-2026-0001 */
  public static String nextCommandeClientCode(String dernierCode) {
    return prochain("CC", dernierCode);
  }

  /** Commande fournisseur : CF-2026-0001 */
  public static String nextCommandeFournisseurCode(String dernierCode) {
    return prochain("CF", dernierCode);
  }

  private static String prochain(String prefixe, String dernierCode) {
    int sequence = extraireSequence(dernierCode, prefixe);
    return prefixe + SEPARATEUR + Year.now().getValue() + SEPARATEUR
        + String.format("%0" + LONGUEUR_SEQ + "d", sequence + 1);
  }

  /** Recherche la plus grande sequence du prefixe dans le code fourni (null-safe) */
  private static int extraireSequence(String code, String prefixe) {
    int max = 0;
    if (code == null || !code.startsWith(prefixe + SEPARATEUR)) {
      return max;
    }
    String[] parties = code.split(SEPARATEUR);
    if (parties.length >= 3) {
      try {
        max = Integer.parseInt(parties[2]);
      } catch (NumberFormatException ignore) {
        // code non conforme au format attendu : on repart de 0
      }
    }
    return max;
  }

  /** Le code est-il fourni (non vide) par le client ? */
  public static boolean estFourni(String code) {
    return code != null && !code.isBlank();
  }

  // -- Extracteurs du "dernier code" depuis les DTO des listes, null-safe --

  public static String codeArticle(ArticleDto article) {
    return article == null ? null : article.getCodeArticle();
  }

  public static String codeCategory(com.k48.gestiondestock.dto.CategoryDto category) {
    return category == null ? null : category.getCode();
  }

  public static String codeVente(VentesDto vente) {
    return vente == null ? null : vente.getCode();
  }

  public static String codeCommandeClient(CommandeClientDto commande) {
    return commande == null ? null : commande.getCode();
  }

  public static String codeCommandeFournisseur(CommandeFournisseurDto commande) {
    return commande == null ? null : commande.getCode();
  }
}
