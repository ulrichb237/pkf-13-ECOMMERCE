package com.k48.gestiondestock.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de réinitialisation de mot de passe")
public class ForgotPasswordRequest {

  @Email(message = "Email invalide")
  @NotBlank(message = "L'email est obligatoire")
  @Schema(description = "Email du compte concerné", example = "admin@demo.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String email;
}
