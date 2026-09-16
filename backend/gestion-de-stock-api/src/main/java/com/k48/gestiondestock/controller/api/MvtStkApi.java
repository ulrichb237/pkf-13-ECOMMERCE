package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.MOUVEMENTS_STOCK_ENDPOINT;

import com.k48.gestiondestock.dto.MvtStkDto;
import com.k48.gestiondestock.handlers.ErrorDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Mouvements de stock", description = "Entrées, sorties et corrections de stock. "
    + "Le stock réel d'un article est la somme de ses mouvements : les entrées sont positives, les sorties négatives.")
public interface MvtStkApi {

  @GetMapping(MOUVEMENTS_STOCK_ENDPOINT + "/articles/{idArticle}/stock-reel")
  @Operation(summary = "Calculer le stock réel d'un article",
      description = "Somme de tous les mouvements de l'article (0 si l'article n'a encore aucun mouvement).")
  @ApiResponse(responseCode = "200", description = "Quantité en stock", content = @Content(schema = @Schema(type = "number", example = "42")))
  @ApiResponse(responseCode = "404", description = "Aucun article avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  BigDecimal stockReelArticle(@Parameter(description = "Identifiant de l'article", example = "1") @PathVariable("idArticle") Integer idArticle);

  @GetMapping(MOUVEMENTS_STOCK_ENDPOINT + "/articles/{idArticle}")
  @Operation(summary = "Lister les mouvements de stock d'un article")
  @ApiResponse(responseCode = "200", description = "Mouvements de l'article (liste vide si aucun)")
  List<MvtStkDto> mvtStkArticle(@Parameter(description = "Identifiant de l'article", example = "1") @PathVariable("idArticle") Integer idArticle);

  @PostMapping(MOUVEMENTS_STOCK_ENDPOINT + "/entree")
  @Operation(summary = "Enregistrer une entrée de stock",
      description = "La quantité est enregistrée en positif et le type forcé à `ENTREE`.")
  @ApiResponse(responseCode = "200", description = "Mouvement enregistré")
  @ApiResponse(responseCode = "400", description = "Mouvement invalide (article, quantité ou date manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  MvtStkDto entreeStock(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Mouvement à enregistrer (sans champ `id`)",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MvtStkDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.MOUVEMENT_STOCK)))
      @RequestBody MvtStkDto dto);

  @PostMapping(MOUVEMENTS_STOCK_ENDPOINT + "/sortie")
  @Operation(summary = "Enregistrer une sortie de stock",
      description = "La quantité est enregistrée en négatif et le type forcé à `SORTIE`.")
  @ApiResponse(responseCode = "200", description = "Mouvement enregistré")
  @ApiResponse(responseCode = "400", description = "Mouvement invalide (article, quantité ou date manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  MvtStkDto sortieStock(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Mouvement à enregistrer (sans champ `id`)",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MvtStkDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.MOUVEMENT_STOCK)))
      @RequestBody MvtStkDto dto);

  @PostMapping(MOUVEMENTS_STOCK_ENDPOINT + "/correction-positive")
  @Operation(summary = "Corriger le stock à la hausse",
      description = "Ajoute la quantité au stock (inventaire). Type forcé à `CORRECTION_POS`.")
  @ApiResponse(responseCode = "200", description = "Mouvement enregistré")
  @ApiResponse(responseCode = "400", description = "Mouvement invalide (article, quantité ou date manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  MvtStkDto correctionStockPos(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Mouvement à enregistrer (sans champ `id`)",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MvtStkDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.MOUVEMENT_STOCK)))
      @RequestBody MvtStkDto dto);

  @PostMapping(MOUVEMENTS_STOCK_ENDPOINT + "/correction-negative")
  @Operation(summary = "Corriger le stock à la baisse",
      description = "Retire la quantité du stock (perte, casse, inventaire). Type forcé à `CORRECTION_NEG`.")
  @ApiResponse(responseCode = "200", description = "Mouvement enregistré")
  @ApiResponse(responseCode = "400", description = "Mouvement invalide (article, quantité ou date manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  MvtStkDto correctionStockNeg(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Mouvement à enregistrer (sans champ `id`)",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MvtStkDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.MOUVEMENT_STOCK)))
      @RequestBody MvtStkDto dto);

}
