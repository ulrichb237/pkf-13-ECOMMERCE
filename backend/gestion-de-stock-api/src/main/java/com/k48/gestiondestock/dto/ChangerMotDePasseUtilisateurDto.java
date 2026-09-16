package com.k48.gestiondestock.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de changement de mot de passe")
public class ChangerMotDePasseUtilisateurDto {

  @Schema(description = "Identifiant de l'utilisateur", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
  private Integer id;

  @Schema(description = "Nouveau mot de passe", example = "N0uveau-Mot-De-Passe", requiredMode = Schema.RequiredMode.REQUIRED)
  private String motDePasse;

  @Schema(description = "Confirmation du nouveau mot de passe (identique)", example = "N0uveau-Mot-De-Passe", requiredMode = Schema.RequiredMode.REQUIRED)
  private String confirmMotDePasse;

}
