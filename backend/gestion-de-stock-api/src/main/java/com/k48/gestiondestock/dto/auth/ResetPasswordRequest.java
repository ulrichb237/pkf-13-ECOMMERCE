package com.k48.gestiondestock.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Confirmation de réinitialisation de mot de passe avec le code reçu")
public class ResetPasswordRequest {

  @NotBlank(message = "Le code de réinitialisation est obligatoire")
  @Schema(description = "Code à 6 chiffres reçu lors de la demande", example = "482913", requiredMode = Schema.RequiredMode.REQUIRED)
  private String code;

  @NotBlank(message = "Le nouveau mot de passe est obligatoire")
  @Schema(description = "Nouveau mot de passe (6 caractères minimum)", requiredMode = Schema.RequiredMode.REQUIRED)
  private String nouveauMotDePasse;
}
