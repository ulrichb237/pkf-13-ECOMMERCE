package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.UTILISATEURS_ENDPOINT;

import com.k48.gestiondestock.dto.ChangerMotDePasseUtilisateurDto;
import com.k48.gestiondestock.dto.UtilisateurDto;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Utilisateurs", description = "Utilisateurs de l'application rattachés à une entreprise")
public interface UtilisateurApi {

  @PostMapping(UTILISATEURS_ENDPOINT)
  @Operation(summary = "Créer ou modifier un utilisateur",
      description = "Crée un utilisateur si le champ `id` est vide, sinon le modifie. Le mot de passe est chiffré avant l'enregistrement.")
  @ApiResponse(responseCode = "200", description = "Utilisateur enregistré")
  @ApiResponse(responseCode = "400", description = "Utilisateur invalide (champs obligatoires manquants)",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  UtilisateurDto save(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = ExemplesOpenApi.AIDE_MODIFICATION,
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UtilisateurDto.class),
          examples = @ExampleObject(name = ExemplesOpenApi.CREATION, value = ExemplesOpenApi.UTILISATEUR)))
      @RequestBody UtilisateurDto dto);

  @GetMapping(UTILISATEURS_ENDPOINT)
  @Operation(summary = "Lister les utilisateurs")
  @ApiResponse(responseCode = "200", description = "Liste des utilisateurs")
  List<UtilisateurDto> findAll();

  @GetMapping(UTILISATEURS_ENDPOINT + "/{idUtilisateur}")
  @Operation(summary = "Rechercher un utilisateur par identifiant")
  @ApiResponse(responseCode = "200", description = "Utilisateur trouvé")
  @ApiResponse(responseCode = "404", description = "Aucun utilisateur avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  UtilisateurDto findById(@Parameter(description = "Identifiant de l'utilisateur", example = "1") @PathVariable("idUtilisateur") Integer id);

  @GetMapping(UTILISATEURS_ENDPOINT + "/email/{email}")
  @Operation(summary = "Rechercher un utilisateur par email")
  @ApiResponse(responseCode = "200", description = "Utilisateur trouvé")
  @ApiResponse(responseCode = "404", description = "Aucun utilisateur avec cet email",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  UtilisateurDto findByEmail(@Parameter(description = "Email de l'utilisateur", example = "contact@k48.com") @PathVariable("email") String email);

  @PatchMapping(UTILISATEURS_ENDPOINT + "/mot-de-passe")
  @Operation(summary = "Changer le mot de passe d'un utilisateur",
      description = "Le nouveau mot de passe et sa confirmation doivent être identiques.")
  @ApiResponse(responseCode = "200", description = "Mot de passe modifié")
  @ApiResponse(responseCode = "400", description = "Identifiant manquant, mot de passe vide ou confirmation différente",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Aucun utilisateur avec cet identifiant",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  UtilisateurDto changerMotDePasse(@RequestBody ChangerMotDePasseUtilisateurDto dto);

  @DeleteMapping(UTILISATEURS_ENDPOINT + "/{idUtilisateur}")
  @Operation(summary = "Supprimer un utilisateur")
  @ApiResponse(responseCode = "200", description = "Utilisateur supprimé")
  void delete(@Parameter(description = "Identifiant de l'utilisateur", example = "1") @PathVariable("idUtilisateur") Integer id);

}
