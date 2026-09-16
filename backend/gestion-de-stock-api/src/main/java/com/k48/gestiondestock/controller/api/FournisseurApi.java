package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.FOURNISSEURS_ENDPOINT;

import com.k48.gestiondestock.dto.FournisseurDto;
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

@Tag(name = "Fournisseurs", description = "Fournisseurs auprès desquels l'entreprise passe ses commandes")
public interface FournisseurApi {

  @PostMapping(FOURNISSEURS_ENDPOINT)
  @Operation(summary = "Créer ou modifier un fournisseur",
      description = "Crée un fournisseur si le champ `id` est vide, sinon modifie le fournisseur existant.")
  @ApiResponse(responseCode = "200", description = "Fournisseur enregistré")
  @ApiResponse(responseCode = "400", description = "Fournisseur invalide (champs obligatoires manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  FournisseurDto save(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = ExemplesOpenApi.AIDE_MODIFICATION,
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FournisseurDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.FOURNISSEUR)))
      @RequestBody FournisseurDto dto);

  @GetMapping(FOURNISSEURS_ENDPOINT)
  @Operation(summary = "Lister les fournisseurs", description = "Renvoie tous les fournisseurs de l'entreprise (liste vide si aucun).")
  @ApiResponse(responseCode = "200", description = "Liste des fournisseurs")
  List<FournisseurDto> findAll();

  @GetMapping(FOURNISSEURS_ENDPOINT + "/{idFournisseur}")
  @Operation(summary = "Rechercher un fournisseur par identifiant")
  @ApiResponse(responseCode = "200", description = "Fournisseur trouvé")
  @ApiResponse(responseCode = "404", description = "Aucun fournisseur avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  FournisseurDto findById(@Parameter(description = "Identifiant du fournisseur", example = "1") @PathVariable("idFournisseur") Integer id);

  @DeleteMapping(FOURNISSEURS_ENDPOINT + "/{idFournisseur}")
  @Operation(summary = "Supprimer un fournisseur", description = "Refusé si le fournisseur est lié à des commandes.")
  @ApiResponse(responseCode = "200", description = "Fournisseur supprimé")
  @ApiResponse(responseCode = "400", description = "Fournisseur lié à des commandes, suppression impossible",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  void delete(@Parameter(description = "Identifiant du fournisseur", example = "1") @PathVariable("idFournisseur") Integer id);

}
