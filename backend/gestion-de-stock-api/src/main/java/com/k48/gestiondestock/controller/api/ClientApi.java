package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.CLIENTS_ENDPOINT;

import com.k48.gestiondestock.dto.ClientDto;
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

@Tag(name = "Clients", description = "Clients de l'entreprise")
public interface ClientApi {

  @PostMapping(value = CLIENTS_ENDPOINT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Créer ou modifier un client",
      description = "Crée un client si le champ `id` est vide, sinon modifie le client existant.")
  @ApiResponse(responseCode = "200", description = "Client enregistré")
  @ApiResponse(responseCode = "400", description = "Client invalide (champs obligatoires manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ClientDto save(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = ExemplesOpenApi.AIDE_MODIFICATION,
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ClientDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.CLIENT)))
      @RequestBody ClientDto dto);

  @GetMapping(value = CLIENTS_ENDPOINT, produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Lister les clients", description = "Renvoie tous les clients de l'entreprise (liste vide si aucun).")
  @ApiResponse(responseCode = "200", description = "Liste des clients")
  List<ClientDto> findAll();

  @GetMapping(value = CLIENTS_ENDPOINT + "/{idClient}", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Rechercher un client par identifiant")
  @ApiResponse(responseCode = "200", description = "Client trouvé")
  @ApiResponse(responseCode = "404", description = "Aucun client avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ClientDto findById(@Parameter(description = "Identifiant du client", example = "1") @PathVariable("idClient") Integer id);

  @DeleteMapping(value = CLIENTS_ENDPOINT + "/{idClient}")
  @Operation(summary = "Supprimer un client", description = "Refusé si le client a déjà passé des commandes.")
  @ApiResponse(responseCode = "200", description = "Client supprimé")
  @ApiResponse(responseCode = "400", description = "Client lié à des commandes, suppression impossible",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  void delete(@Parameter(description = "Identifiant du client", example = "1") @PathVariable("idClient") Integer id);

}
