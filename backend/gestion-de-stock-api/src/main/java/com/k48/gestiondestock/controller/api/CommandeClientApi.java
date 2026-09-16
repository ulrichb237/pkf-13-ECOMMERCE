package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.COMMANDES_CLIENTS_ENDPOINT;

import com.k48.gestiondestock.dto.CommandeClientDto;
import com.k48.gestiondestock.dto.LigneCommandeClientDto;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Commandes clients", description = "Commandes passées par les clients et leurs lignes. "
    + "Une commande livrée ne peut plus être modifiée.")
public interface CommandeClientApi {

  @PostMapping(COMMANDES_CLIENTS_ENDPOINT)
  @Operation(summary = "Créer ou modifier une commande client",
      description = "Crée la commande et ses lignes si le champ `id` est vide, sinon modifie la commande existante.")
  @ApiResponse(responseCode = "200", description = "Commande enregistrée")
  @ApiResponse(responseCode = "400", description = "Commande invalide ou déjà livrée",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Client ou article introuvable",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<CommandeClientDto> save(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = ExemplesOpenApi.AIDE_MODIFICATION,
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CommandeClientDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.COMMANDE_CLIENT)))
      @RequestBody CommandeClientDto dto);

  @GetMapping(COMMANDES_CLIENTS_ENDPOINT)
  @Operation(summary = "Lister les commandes clients")
  @ApiResponse(responseCode = "200", description = "Liste des commandes clients")
  ResponseEntity<List<CommandeClientDto>> findAll();

  @GetMapping(COMMANDES_CLIENTS_ENDPOINT + "/{idCommande}")
  @Operation(summary = "Rechercher une commande client par identifiant")
  @ApiResponse(responseCode = "200", description = "Commande trouvée")
  @ApiResponse(responseCode = "404", description = "Aucune commande avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<CommandeClientDto> findById(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommandeClient);

  @GetMapping(COMMANDES_CLIENTS_ENDPOINT + "/code/{codeCommande}")
  @Operation(summary = "Rechercher une commande client par code")
  @ApiResponse(responseCode = "200", description = "Commande trouvée")
  @ApiResponse(responseCode = "404", description = "Aucune commande avec ce code",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<CommandeClientDto> findByCode(
      @Parameter(description = "Code de la commande", example = "CC-2026-001") @PathVariable("codeCommande") String code);

  @GetMapping(COMMANDES_CLIENTS_ENDPOINT + "/{idCommande}/lignes")
  @Operation(summary = "Lister les lignes d'une commande client")
  @ApiResponse(responseCode = "200", description = "Lignes de la commande")
  ResponseEntity<List<LigneCommandeClientDto>> findAllLignesCommandesClientByCommandeClientId(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande);

  @PatchMapping(COMMANDES_CLIENTS_ENDPOINT + "/{idCommande}/etat/{etatCommande}")
  @Operation(summary = "Changer l'état d'une commande client",
      description = "Passer la commande à `LIVREE` génère les sorties de stock correspondantes.")
  @ApiResponse(responseCode = "200", description = "Commande mise à jour")
  @ApiResponse(responseCode = "400", description = "Commande introuvable, déjà livrée ou état absent",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<CommandeClientDto> updateEtatCommande(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Nouvel état de la commande") @PathVariable("etatCommande") EtatCommande etatCommande);

  @PatchMapping(COMMANDES_CLIENTS_ENDPOINT + "/{idCommande}/lignes/{idLigneCommande}/quantite/{quantite}")
  @Operation(summary = "Modifier la quantité d'une ligne de commande client")
  @ApiResponse(responseCode = "200", description = "Commande mise à jour")
  @ApiResponse(responseCode = "400", description = "Quantité nulle ou négative, ligne introuvable ou commande déjà livrée",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<CommandeClientDto> updateQuantiteCommande(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Identifiant de la ligne de commande", example = "1") @PathVariable("idLigneCommande") Integer idLigneCommande,
      @Parameter(description = "Nouvelle quantité (strictement positive)", example = "3") @PathVariable("quantite") BigDecimal quantite);

  @PatchMapping(COMMANDES_CLIENTS_ENDPOINT + "/{idCommande}/client/{idClient}")
  @Operation(summary = "Changer le client d'une commande")
  @ApiResponse(responseCode = "200", description = "Commande mise à jour")
  @ApiResponse(responseCode = "400", description = "Commande déjà livrée ou identifiant manquant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Client introuvable",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<CommandeClientDto> updateClient(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Identifiant du nouveau client", example = "2") @PathVariable("idClient") Integer idClient);

  @PatchMapping(COMMANDES_CLIENTS_ENDPOINT + "/{idCommande}/lignes/{idLigneCommande}/article/{idArticle}")
  @Operation(summary = "Remplacer l'article d'une ligne de commande client")
  @ApiResponse(responseCode = "200", description = "Commande mise à jour")
  @ApiResponse(responseCode = "400", description = "Commande déjà livrée ou article invalide",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Ligne de commande ou article introuvable",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<CommandeClientDto> updateArticle(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Identifiant de la ligne de commande", example = "1") @PathVariable("idLigneCommande") Integer idLigneCommande,
      @Parameter(description = "Identifiant du nouvel article", example = "2") @PathVariable("idArticle") Integer idArticle);

  @DeleteMapping(COMMANDES_CLIENTS_ENDPOINT + "/{idCommande}/lignes/{idLigneCommande}")
  @Operation(summary = "Supprimer une ligne d'une commande client")
  @ApiResponse(responseCode = "200", description = "Ligne supprimée, commande renvoyée")
  @ApiResponse(responseCode = "400", description = "Commande déjà livrée ou identifiant manquant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Ligne de commande introuvable",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<CommandeClientDto> deleteArticle(
      @Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer idCommande,
      @Parameter(description = "Identifiant de la ligne à supprimer", example = "1") @PathVariable("idLigneCommande") Integer idLigneCommande);

  @DeleteMapping(COMMANDES_CLIENTS_ENDPOINT + "/{idCommande}")
  @Operation(summary = "Supprimer une commande client", description = "Refusé si la commande contient des lignes.")
  @ApiResponse(responseCode = "200", description = "Commande supprimée")
  @ApiResponse(responseCode = "400", description = "Commande non vide, suppression impossible",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<Void> delete(@Parameter(description = "Identifiant de la commande", example = "1") @PathVariable("idCommande") Integer id);

}
