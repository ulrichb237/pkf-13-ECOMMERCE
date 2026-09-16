package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.ENTREPRISES_ENDPOINT;

import com.k48.gestiondestock.dto.EntrepriseDto;
import com.k48.gestiondestock.handlers.ErrorDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Entreprises", description = "Entreprises clientes de l'application. Chaque donnée métier appartient à une entreprise.")
public interface EntrepriseApi {

  @PostMapping(ENTREPRISES_ENDPOINT)
  @SecurityRequirements
  @Operation(summary = "Inscrire une entreprise",
      description = "Endpoint public. Crée l'entreprise ainsi qu'un utilisateur administrateur (rôle `ADMIN`) "
          + "dont l'email est celui de l'entreprise et le mot de passe celui défini par `ENTREPRISE_DEFAULT_PASSWORD`.")
  @ApiResponse(responseCode = "200", description = "Entreprise créée")
  @ApiResponse(responseCode = "400", description = "Entreprise invalide (champs obligatoires ou adresse manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  EntrepriseDto save(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = ExemplesOpenApi.AIDE_MODIFICATION,
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = EntrepriseDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.ENTREPRISE)))
      @RequestBody EntrepriseDto dto);

  @GetMapping(ENTREPRISES_ENDPOINT)
  @Operation(summary = "Lister les entreprises")
  @ApiResponse(responseCode = "200", description = "Liste des entreprises")
  List<EntrepriseDto> findAll();

  @GetMapping(ENTREPRISES_ENDPOINT + "/{idEntreprise}")
  @Operation(summary = "Rechercher une entreprise par identifiant")
  @ApiResponse(responseCode = "200", description = "Entreprise trouvée")
  @ApiResponse(responseCode = "404", description = "Aucune entreprise avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  EntrepriseDto findById(@Parameter(description = "Identifiant de l'entreprise", example = "1") @PathVariable("idEntreprise") Integer id);

  @DeleteMapping(ENTREPRISES_ENDPOINT + "/{idEntreprise}")
  @Operation(summary = "Supprimer une entreprise")
  @ApiResponse(responseCode = "200", description = "Entreprise supprimée")
  void delete(@Parameter(description = "Identifiant de l'entreprise", example = "1") @PathVariable("idEntreprise") Integer id);

}
