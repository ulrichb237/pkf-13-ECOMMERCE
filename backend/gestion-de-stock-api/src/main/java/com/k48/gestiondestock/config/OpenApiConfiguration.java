package com.k48.gestiondestock.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfiguration {

  private static final String BEARER_AUTH = "bearerAuth";

  private static final String DESCRIPTION = """
      API REST de gestion de stock multi-entreprise : articles, catégories, clients, fournisseurs,
      commandes, ventes et mouvements de stock.

      **Pour tester l'API**
      1. Inscrire une entreprise avec `POST /api/v1/entreprises`. Un administrateur est créé avec l'email de l'entreprise.
      2. Se connecter avec `POST /api/v1/authentification/connexion` et copier la valeur de `accessToken`.
      3. Cliquer sur **Authorize** et coller le jeton (sans le préfixe `Bearer`).

      Chaque requête authentifiée ne voit que les données de l'entreprise contenue dans le jeton.

      **Erreurs** : les réponses 400 et 404 renvoient un objet `ErrorDto` (code métier, message et détail des erreurs).
      """;

  @Bean
  public OpenAPI gestionDeStockOpenApi(@Value("${app.version:dev}") String version) {
    return new OpenAPI()
        .info(new Info()
            .title("API Gestion de stock")
            .version(version)
            .description(DESCRIPTION)
            .contact(new Contact().name("K48")))
        .components(new Components().addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .description("Jeton obtenu avec POST /api/v1/authentification/connexion")))
        .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
  }

  /**
   * Ajoute la reponse 401 a toutes les operations protegees.
   * Les operations publiques sont annotees avec @SecurityRequirements vide : leur liste de securite est vide.
   */
  @Bean
  public OpenApiCustomizer reponseNonAuthentifieCustomizer() {
    return openApi -> openApi.getPaths().values().stream()
        .flatMap(pathItem -> pathItem.readOperations().stream())
        .filter(operation -> operation.getSecurity() == null || !operation.getSecurity().isEmpty())
        .forEach(operation -> operation.getResponses().addApiResponse("401",
            new ApiResponse().description("Jeton JWT absent, invalide ou expiré")));
  }
}
