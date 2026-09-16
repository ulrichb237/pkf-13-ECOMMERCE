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
@Schema(description = "Identifiants de connexion")
public class AuthenticationRequest {

  @Schema(description = "Email de l'utilisateur", example = "contact@k48.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String login;

  @Schema(description = "Mot de passe", example = "M0t-De-Passe", requiredMode = Schema.RequiredMode.REQUIRED)
  private String password;

}
