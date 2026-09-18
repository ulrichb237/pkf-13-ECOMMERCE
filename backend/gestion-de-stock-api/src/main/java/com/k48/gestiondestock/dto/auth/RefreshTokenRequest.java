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
@Schema(description = "Jeton de renouvellement (refresh / deconnexion)")
public class RefreshTokenRequest {

  @Schema(description = "Jeton de renouvellement reçu à la connexion", requiredMode = Schema.RequiredMode.REQUIRED)
  private String refreshToken;

}
