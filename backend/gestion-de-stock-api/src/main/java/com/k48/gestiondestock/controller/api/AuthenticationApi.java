package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.AUTHENTIFICATION_ENDPOINT;

import com.k48.gestiondestock.dto.auth.AuthenticationRequest;
import com.k48.gestiondestock.dto.auth.AuthenticationResponse;
import com.k48.gestiondestock.dto.auth.ForgotPasswordRequest;
import com.k48.gestiondestock.dto.auth.ForgotPasswordResponse;
import com.k48.gestiondestock.dto.auth.RefreshTokenRequest;
import com.k48.gestiondestock.dto.auth.ResetPasswordRequest;
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

@Tag(name = "Authentification", description = "Connexion, renouvellement de jeton et deconnexion")
public interface AuthenticationApi {

  @PostMapping(value = AUTHENTIFICATION_ENDPOINT + "/connexion", consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @SecurityRequirements
  @Operation(summary = "Se connecter",
      description = "Vérifie l'email et le mot de passe puis renvoie un `accessToken` (court terme) "
          + "et un `refreshToken` (7 jours, à envoyer à /refresh pour obtenir un nouveau couple de jetons).")
  @ApiResponse(responseCode = "200", description = "Connexion réussie, jetons renvoyés")
  @ApiResponse(responseCode = "400", description = "Email ou mot de passe incorrect",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Aucun utilisateur avec cet email",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request);

  @PostMapping(value = AUTHENTIFICATION_ENDPOINT + "/refresh", consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @SecurityRequirements
  @Operation(summary = "Renouveller les jetons",
      description = "Échange un `refreshToken` valide contre un nouveau couple access/refresh "
          + "(rotation : l'ancien refresh token est révoqué). À appeler quand l'accessToken expire.")
  @ApiResponse(responseCode = "200", description = "Nouveaux jetons renvoyés")
  @ApiResponse(responseCode = "400", description = "Refresh token manquant, inconnu ou expiré",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<AuthenticationResponse> refresh(@RequestBody RefreshTokenRequest request);

  @PostMapping(value = AUTHENTIFICATION_ENDPOINT + "/deconnexion", consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @SecurityRequirements
  @Operation(summary = "Se déconnecter",
      description = "Révoque le `refreshToken` fourni : il ne pourra plus être utilisé. "
          + "L'access token en cours reste valide jusqu'à son expiration naturelle.")
  @ApiResponse(responseCode = "200", description = "Jeton révoqué")
  ResponseEntity<Void> deconnexion(@RequestBody RefreshTokenRequest request);

  @PostMapping(value = AUTHENTIFICATION_ENDPOINT + "/mot-de-passe-oublie", consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @SecurityRequirements
  @Operation(summary = "Demander une réinitialisation de mot de passe",
      description = "Génère un code à 6 chiffres valable 15 minutes (usage unique). "
          + "La réponse est volontairement identique que l'email existe ou non. "
          + "Sans serveur SMTP configuré, le code est renvoyé dans la réponse pour l'UI.")
  @ApiResponse(responseCode = "200", description = "Demande enregistrée")
  ResponseEntity<ForgotPasswordResponse> forgotPassword(@RequestBody ForgotPasswordRequest request);

  @PostMapping(value = AUTHENTIFICATION_ENDPOINT + "/reinitialisation", consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @SecurityRequirements
  @Operation(summary = "Réinitialiser le mot de passe",
      description = "Vérifie le code reçu puis remplace le mot de passe. Le nouveau mot de passe doit contenir au moins 6 caractères.")
  @ApiResponse(responseCode = "200", description = "Mot de passe réinitialisé")
  @ApiResponse(responseCode = "400", description = "Code invalide ou expiré, mot de passe trop court",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Code de réinitialisation inconnu",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  ResponseEntity<Void> reinitialiserMotDePasse(@RequestBody ResetPasswordRequest request);

}
