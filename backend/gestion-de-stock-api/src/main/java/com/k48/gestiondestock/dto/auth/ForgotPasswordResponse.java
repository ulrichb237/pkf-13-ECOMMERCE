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
@Schema(description = "Réponse de la demande de réinitialisation de mot de passe")
public class ForgotPasswordResponse {

  @Schema(description = "Message à afficher à l'utilisateur")
  private String message;

  @Schema(description = "Code à 6 chiffres, renvoyé uniquement en l'absence de serveur SMTP "
      + "(à supprimer lorsqu'un service d'envoi d'emails sera branché — voir MODIFICATIONS_BACKEND.md)",
      nullable = true)
  private String code;
}
