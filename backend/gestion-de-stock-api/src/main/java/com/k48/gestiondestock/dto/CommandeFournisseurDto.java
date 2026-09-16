package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.k48.gestiondestock.model.CommandeFournisseur;
import com.k48.gestiondestock.model.EtatCommande;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Commande passée auprès d'un fournisseur")
public class CommandeFournisseurDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(description = "Code unique de la commande", example = "CF-2026-001", requiredMode = Schema.RequiredMode.REQUIRED)
  private String code;

  @Schema(description = "Date de la commande (UTC)", example = "2026-09-16T10:00:00Z", requiredMode = Schema.RequiredMode.REQUIRED)
  private Instant dateCommande;

  @Schema(description = "État de la commande", requiredMode = Schema.RequiredMode.REQUIRED)
  private EtatCommande etatCommande;

  @Schema(description = "Fournisseur concerné (seul son identifiant est nécessaire)", requiredMode = Schema.RequiredMode.REQUIRED)
  private FournisseurDto fournisseur;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  @Schema(description = "Lignes de la commande")
  private List<LigneCommandeFournisseurDto> ligneCommandeFournisseurs;

  public static CommandeFournisseurDto fromEntity(CommandeFournisseur commandeFournisseur) {
    if (commandeFournisseur == null) {
      return null;
    }
    return CommandeFournisseurDto.builder()
        .id(commandeFournisseur.getId())
        .code(commandeFournisseur.getCode())
        .dateCommande(commandeFournisseur.getDateCommande())
        .fournisseur(FournisseurDto.fromEntity(commandeFournisseur.getFournisseur()))
        .etatCommande(commandeFournisseur.getEtatCommande())
        .idEntreprise(commandeFournisseur.getIdEntreprise())
        .build();
  }

  public static CommandeFournisseur toEntity(CommandeFournisseurDto dto) {
    if (dto == null) {
      return null;
    }
    CommandeFournisseur commandeFournisseur = new CommandeFournisseur();
    commandeFournisseur.setId(dto.getId());
    commandeFournisseur.setCode(dto.getCode());
    commandeFournisseur.setDateCommande(dto.getDateCommande());
    commandeFournisseur.setFournisseur(FournisseurDto.toEntity(dto.getFournisseur()));
    commandeFournisseur.setIdEntreprise(dto.getIdEntreprise());
    commandeFournisseur.setEtatCommande(dto.getEtatCommande());
    return commandeFournisseur;
  }

  public boolean isCommandeLivree() {
    return EtatCommande.LIVREE.equals(this.etatCommande);
  }

}
