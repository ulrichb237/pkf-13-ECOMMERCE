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

}
