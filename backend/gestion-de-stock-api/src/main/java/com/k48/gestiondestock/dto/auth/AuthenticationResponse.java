package com.k48.gestiondestock.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Résultat d'une connexion réussie")
public class AuthenticationResponse {

  @Schema(description = "Jeton JWT à envoyer dans l'en-tête Authorization: Bearer <jeton>", example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb250YWN0QGs0OC5jb20ifQ.signature")
  private String accessToken;

  @Schema(description = "Jeton de renouvellement : à conserver côté client, à envoyer à /authentification/refresh quand le jeton d'accès expire ; révoqué à la déconnexion")
  private String refreshToken;

  @Schema(description = "Durée de vie du jeton d'accès en secondes", example = "36000")
  private Long expiresIn;

  @Schema(description = "Email de l'utilisateur connecté", example = "contact@k48.com")
  private String email;

}
