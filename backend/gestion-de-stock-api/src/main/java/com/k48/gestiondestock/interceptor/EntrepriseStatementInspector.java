package com.k48.gestiondestock.interceptor;

import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.hibernate.resource.jdbc.spi.StatementInspector;
import org.slf4j.MDC;
import org.springframework.util.StringUtils;

/**
 * Filtre multi-entreprise : ajoute "identreprise = <entreprise du jeton JWT>" a chaque requete SELECT,
 * pour qu'un utilisateur ne voie que les donnees de son entreprise.
 * L'identifiant est place dans le MDC par ApplicationRequestFilter.
 */
public class EntrepriseStatementInspector implements StatementInspector {

  // Tables qui n'ont pas de colonne identreprise
  private static final Set<String> TABLES_SANS_ENTREPRISE = Set.of("entreprise", "roles");

  // Table et alias de la requete principale generee par Hibernate, ex. : "from article a1_0"
  private static final Pattern TABLE_PRINCIPALE = Pattern.compile("\\sfrom\\s+(\\w+)\\s+([a-z]\\w*_\\d+)\\b", Pattern.CASE_INSENSITIVE);

  private static final Pattern WHERE = Pattern.compile("\\swhere\\s", Pattern.CASE_INSENSITIVE);

  // Clauses qui doivent rester apres le filtre
  private static final Pattern FIN_DE_REQUETE = Pattern.compile("\\s(order\\s+by|group\\s+by|limit|offset|fetch|for\\s+update)\\s",
      Pattern.CASE_INSENSITIVE);

  @Override
  public String inspect(String sql) {
    final String idEntreprise = MDC.get("idEntreprise");
    if (!StringUtils.hasLength(sql) || !StringUtils.hasLength(idEntreprise) || !sql.regionMatches(true, 0, "select", 0, 6)) {
      return sql;
    }

    final Matcher table = TABLE_PRINCIPALE.matcher(sql);
    if (!table.find() || TABLES_SANS_ENTREPRISE.contains(table.group(1).toLowerCase())) {
      return sql;
    }

    // parseInt : l'identifiant vient du jeton, mais on refuse tout ce qui n'est pas un nombre avant de l'injecter dans le SQL
    final String condition = table.group(2) + ".identreprise = " + Integer.parseInt(idEntreprise);

    final Matcher where = WHERE.matcher(sql);
    if (where.find(table.end())) {
      final int finWhere = finDeRequete(sql, where.end());
      // Les conditions existantes sont entourees de parentheses pour ne pas etre modifiees par un OR
      return sql.substring(0, where.start()) + " where " + condition
          + " and (" + sql.substring(where.end(), finWhere).trim() + ")" + sql.substring(finWhere);
    }

    final int fin = finDeRequete(sql, table.end());
    return sql.substring(0, fin) + " where " + condition + sql.substring(fin);
  }

  private int finDeRequete(String sql, int debut) {
    final Matcher fin = FIN_DE_REQUETE.matcher(sql);
    return fin.find(debut) ? fin.start() : sql.length();
  }
}
