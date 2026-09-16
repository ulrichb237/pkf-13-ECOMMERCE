package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.CATEGORIES_ENDPOINT;

import com.k48.gestiondestock.dto.CategoryDto;
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

@Tag(name = "Catégories", description = "Catégories servant à classer les articles")
public interface CategoryApi {

  @PostMapping(value = CATEGORIES_ENDPOINT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Créer ou modifier une catégorie",
      description = "Crée une catégorie si le champ `id` est vide, sinon modifie la catégorie existante.")
  @ApiResponse(responseCode = "200", description = "Catégorie enregistrée")
  @ApiResponse(responseCode = "400", description = "Catégorie invalide (code obligatoire)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CategoryDto save(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = ExemplesOpenApi.AIDE_MODIFICATION,
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CategoryDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.CATEGORIE)))
      @RequestBody CategoryDto dto);

  @GetMapping(value = CATEGORIES_ENDPOINT, produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Lister les catégories", description = "Renvoie toutes les catégories de l'entreprise (liste vide si aucune).")
  @ApiResponse(responseCode = "200", description = "Liste des catégories")
  List<CategoryDto> findAll();

  @GetMapping(value = CATEGORIES_ENDPOINT + "/{idCategorie}", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Rechercher une catégorie par identifiant")
  @ApiResponse(responseCode = "200", description = "Catégorie trouvée")
  @ApiResponse(responseCode = "404", description = "Aucune catégorie avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CategoryDto findById(@Parameter(description = "Identifiant de la catégorie", example = "1") @PathVariable("idCategorie") Integer idCategory);

  @GetMapping(value = CATEGORIES_ENDPOINT + "/code/{codeCategorie}", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Rechercher une catégorie par code")
  @ApiResponse(responseCode = "200", description = "Catégorie trouvée")
  @ApiResponse(responseCode = "404", description = "Aucune catégorie avec ce code",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CategoryDto findByCode(@Parameter(description = "Code de la catégorie", example = "CAT-INFO") @PathVariable("codeCategorie") String codeCategory);

  @DeleteMapping(value = CATEGORIES_ENDPOINT + "/{idCategorie}")
  @Operation(summary = "Supprimer une catégorie", description = "Refusé si des articles sont rattachés à la catégorie.")
  @ApiResponse(responseCode = "200", description = "Catégorie supprimée")
  @ApiResponse(responseCode = "400", description = "Catégorie utilisée par des articles, suppression impossible",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  void delete(@Parameter(description = "Identifiant de la catégorie", example = "1") @PathVariable("idCategorie") Integer id);

}
