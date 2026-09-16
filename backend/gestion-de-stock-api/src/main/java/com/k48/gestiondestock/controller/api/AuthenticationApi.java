package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.AUTHENTIFICATION_ENDPOINT;

import com.k48.gestiondestock.dto.auth.AuthenticationRequest;
import com.k48.gestiondestock.dto.auth.AuthenticationResponse;
import com.k48.gestiondestock.handlers.ErrorDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Authentification", description = "Connexion et obtention du jeton JWT à fournir aux autres endpoints")
public interface AuthenticationApi {

  @PostMapping(value = AUTHENTIFICATION_ENDPOINT + "/connexion", consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @SecurityRequirements
  @Operation(summary = "Se connecter",
      description = "Vérifie l'email et le mot de passe puis renvoie un jeton JWT. "
          + "Copier la valeur de `accessToken` dans le bouton **Authorize** pour appeler les autres endpoints.")
  @ApiResponse(responseCode = "200", description = "Connexion réussie, jeton JWT renvoyé")
  @ApiResponse(responseCode = "400", description = "Email ou mot de passe incorrect",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Aucun utilisateur avec cet email",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request);

}
