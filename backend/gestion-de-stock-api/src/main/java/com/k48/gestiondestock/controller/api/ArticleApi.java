package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.ARTICLES_ENDPOINT;
import static com.k48.gestiondestock.utils.Constants.CATEGORIES_ENDPOINT;

import com.k48.gestiondestock.dto.ArticleDto;
import com.k48.gestiondestock.dto.LigneCommandeClientDto;
import com.k48.gestiondestock.dto.LigneCommandeFournisseurDto;
import com.k48.gestiondestock.dto.LigneVenteDto;
import com.k48.gestiondestock.handlers.ErrorDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Articles", description = "Catalogue des articles de l'entreprise et historique de leurs mouvements commerciaux")
public interface ArticleApi {

  @PostMapping(value = ARTICLES_ENDPOINT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Créer ou modifier un article",
      description = "Crée un article si le champ `id` est vide, sinon modifie l'article existant.")
  @ApiResponse(responseCode = "200", description = "Article enregistré")
  @ApiResponse(responseCode = "400", description = "Article invalide (champs obligatoires manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ArticleDto save(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = ExemplesOpenApi.AIDE_MODIFICATION,
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ArticleDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.ARTICLE)))
      @RequestBody ArticleDto dto);

  @GetMapping(value = ARTICLES_ENDPOINT, produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Lister les articles", description = "Renvoie tous les articles de l'entreprise (liste vide si aucun).")
  @ApiResponse(responseCode = "200", description = "Liste des articles")
  List<ArticleDto> findAll();

  @GetMapping(value = ARTICLES_ENDPOINT + "/{idArticle}", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Rechercher un article par identifiant")
  @ApiResponse(responseCode = "200", description = "Article trouvé")
  @ApiResponse(responseCode = "404", description = "Aucun article avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ArticleDto findById(@Parameter(description = "Identifiant de l'article", example = "1") @PathVariable("idArticle") Integer id);

  @GetMapping(value = ARTICLES_ENDPOINT + "/code/{codeArticle}", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Rechercher un article par code")
  @ApiResponse(responseCode = "200", description = "Article trouvé")
  @ApiResponse(responseCode = "404", description = "Aucun article avec ce code",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ArticleDto findByCodeArticle(@Parameter(description = "Code de l'article", example = "ART-001") @PathVariable("codeArticle") String codeArticle);

  @GetMapping(value = ARTICLES_ENDPOINT + "/{idArticle}/historique-ventes", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Historique des ventes d'un article", description = "Renvoie les lignes de vente qui contiennent l'article.")
  @ApiResponse(responseCode = "200", description = "Lignes de vente de l'article")
  List<LigneVenteDto> findHistoriqueVentes(@Parameter(description = "Identifiant de l'article", example = "1") @PathVariable("idArticle") Integer idArticle);

  @GetMapping(value = ARTICLES_ENDPOINT + "/{idArticle}/historique-commandes-clients", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Historique des commandes clients d'un article",
      description = "Renvoie les lignes de commande client qui contiennent l'article.")
  @ApiResponse(responseCode = "200", description = "Lignes de commande client de l'article")
  List<LigneCommandeClientDto> findHistoriqueCommandeClient(
      @Parameter(description = "Identifiant de l'article", example = "1") @PathVariable("idArticle") Integer idArticle);

  @GetMapping(value = ARTICLES_ENDPOINT + "/{idArticle}/historique-commandes-fournisseurs", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Historique des commandes fournisseurs d'un article",
      description = "Renvoie les lignes de commande fournisseur qui contiennent l'article.")
  @ApiResponse(responseCode = "200", description = "Lignes de commande fournisseur de l'article")
  List<LigneCommandeFournisseurDto> findHistoriqueCommandeFournisseur(
      @Parameter(description = "Identifiant de l'article", example = "1") @PathVariable("idArticle") Integer idArticle);

  @GetMapping(value = CATEGORIES_ENDPOINT + "/{idCategorie}/articles", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Lister les articles d'une catégorie")
  @ApiResponse(responseCode = "200", description = "Articles de la catégorie (liste vide si aucun)")
  List<ArticleDto> findAllArticleByIdCategory(
      @Parameter(description = "Identifiant de la catégorie", example = "1") @PathVariable("idCategorie") Integer idCategory);

  @DeleteMapping(value = ARTICLES_ENDPOINT + "/{idArticle}")
  @Operation(summary = "Supprimer un article",
      description = "Refusé si l'article est déjà utilisé dans une commande client, une commande fournisseur ou une vente.")
  @ApiResponse(responseCode = "200", description = "Article supprimé")
  @ApiResponse(responseCode = "400", description = "Article déjà utilisé, suppression impossible",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  void delete(@Parameter(description = "Identifiant de l'article", example = "1") @PathVariable("idArticle") Integer id);

}
