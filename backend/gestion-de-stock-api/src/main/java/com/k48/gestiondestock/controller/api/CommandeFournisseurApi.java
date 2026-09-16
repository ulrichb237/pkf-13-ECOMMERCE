package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.COMMANDES_FOURNISSEURS_ENDPOINT;

import com.k48.gestiondestock.dto.CommandeFournisseurDto;
import com.k48.gestiondestock.dto.LigneCommandeFournisseurDto;
import com.k48.gestiondestock.handlers.ErrorDto;
import com.k48.gestiondestock.model.EtatCommande;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Commandes fournisseurs", description = "Commandes passées auprès des fournisseurs et leurs lignes. "
    + "Une commande livrée ne peut plus être modifiée.")
public interface CommandeFournisseurApi {

  @PostMapping(COMMANDES_FOURNISSEURS_ENDPOINT)
  @Operation(summary = "Créer ou modifier une commande fournisseur",
      description = "Crée la commande et ses lignes si le champ `id` est vide, sinon modifie la commande existante.")
  @ApiResponse(responseCode = "200", description = "Commande enregistrée")
  @ApiResponse(responseCode = "400", description = "Commande invalide ou déjà livrée",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Fournisseur ou article introuvable",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CommandeFournisseurDto save(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = ExemplesOpenApi.AIDE_MODIFICATION,
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CommandeFournisseurDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.COMMANDE_FOURNISSEUR)))
      @RequestBody CommandeFournisseurDto dto);

  @GetMapping(COMMANDES_FOURNISSEURS_ENDPOINT)
  @Operation(summary = "Lister les commandes fournisseurs")
  @ApiResponse(responseCode = "200", description = "Liste des commandes fournisseurs")
  List<CommandeFournisseurDto> findAll();

  @GetMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/{idCommande}")
  @Operation(summary = "Rechercher une commande fournisseur par identifiant")
  @ApiResponse(responseCode = "200", description = "Commande trouvée")
  @ApiResponse(responseCode = "404", description = "Aucune commande avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CommandeFournisseurDto findById(@Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer id);

  @GetMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/code/{codeCommande}")
  @Operation(summary = "Rechercher une commande fournisseur par code")
  @ApiResponse(responseCode = "200", description = "Commande trouvée")
  @ApiResponse(responseCode = "404", description = "Aucune commande avec ce code",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CommandeFournisseurDto findByCode(@Parameter(description = "Code de la commande", example = "CF-2026-001") @PathVariable("codeCommande") String code);

  @GetMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/{idCommande}/lignes")
  @Operation(summary = "Lister les lignes d'une commande fournisseur")
  @ApiResponse(responseCode = "200", description = "Lignes de la commande")
  List<LigneCommandeFournisseurDto> findAllLignesCommandesFournisseurByCommandeFournisseurId(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande);

  @PatchMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/{idCommande}/etat/{etatCommande}")
  @Operation(summary = "Changer l'état d'une commande fournisseur",
      description = "Passer la commande à `LIVREE` génère les entrées de stock correspondantes.")
  @ApiResponse(responseCode = "200", description = "Commande mise à jour")
  @ApiResponse(responseCode = "400", description = "Commande introuvable, déjà livrée ou état absent",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CommandeFournisseurDto updateEtatCommande(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Nouvel état de la commande") @PathVariable("etatCommande") EtatCommande etatCommande);

  @PatchMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/{idCommande}/lignes/{idLigneCommande}/quantite/{quantite}")
  @Operation(summary = "Modifier la quantité d'une ligne de commande fournisseur")
  @ApiResponse(responseCode = "200", description = "Commande mise à jour")
  @ApiResponse(responseCode = "400", description = "Quantité nulle ou négative, ligne introuvable ou commande déjà livrée",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CommandeFournisseurDto updateQuantiteCommande(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Identifiant de la ligne de commande", example = "1") @PathVariable("idLigneCommande") Integer idLigneCommande,
      @Parameter(description = "Nouvelle quantité (strictement positive)", example = "10") @PathVariable("quantite") BigDecimal quantite);

  @PatchMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/{idCommande}/fournisseur/{idFournisseur}")
  @Operation(summary = "Changer le fournisseur d'une commande")
  @ApiResponse(responseCode = "200", description = "Commande mise à jour")
  @ApiResponse(responseCode = "400", description = "Commande déjà livrée ou identifiant manquant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Fournisseur introuvable",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CommandeFournisseurDto updateFournisseur(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Identifiant du nouveau fournisseur", example = "2") @PathVariable("idFournisseur") Integer idFournisseur);

  @PatchMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/{idCommande}/lignes/{idLigneCommande}/article/{idArticle}")
  @Operation(summary = "Remplacer l'article d'une ligne de commande fournisseur")
  @ApiResponse(responseCode = "200", description = "Commande mise à jour")
  @ApiResponse(responseCode = "400", description = "Commande déjà livrée ou article invalide",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Ligne de commande ou article introuvable",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CommandeFournisseurDto updateArticle(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Identifiant de la ligne de commande", example = "1") @PathVariable("idLigneCommande") Integer idLigneCommande,
      @Parameter(description = "Identifiant du nouvel article", example = "2") @PathVariable("idArticle") Integer idArticle);

  @DeleteMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/{idCommande}/lignes/{idLigneCommande}")
  @Operation(summary = "Supprimer une ligne d'une commande fournisseur")
  @ApiResponse(responseCode = "200", description = "Ligne supprimée, commande renvoyée")
  @ApiResponse(responseCode = "400", description = "Commande déjà livrée ou identifiant manquant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Ligne de commande introuvable",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  CommandeFournisseurDto deleteArticle(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Identifiant de la ligne à supprimer", example = "1") @PathVariable("idLigneCommande") Integer idLigneCommande);

  @DeleteMapping(COMMANDES_FOURNISSEURS_ENDPOINT + "/{idCommande}")
  @Operation(summary = "Supprimer une commande fournisseur", description = "Refusé si la commande contient des lignes.")
  @ApiResponse(responseCode = "200", description = "Commande supprimée")
  @ApiResponse(responseCode = "400", description = "Commande non vide, suppression impossible",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  void delete(@Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer id);

}
