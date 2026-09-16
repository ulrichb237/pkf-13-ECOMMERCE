package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.k48.gestiondestock.model.LigneCommandeClient;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ligne d'une commande client")
public class LigneCommandeClientDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(description = "Article commandé (seul son identifiant est nécessaire)")
  private ArticleDto article;

  @JsonIgnore
  private CommandeClientDto commandeClient;

  @Schema(description = "Quantité commandée", example = "2")
  private BigDecimal quantite;

  @Schema(description = "Prix unitaire appliqué", example = "11925")
  private BigDecimal prixUnitaire;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  public static LigneCommandeClientDto fromEntity(LigneCommandeClient ligneCommandeClient) {
    if (ligneCommandeClient == null) {
      return null;
    }
    return LigneCommandeClientDto.builder()
        .id(ligneCommandeClient.getId())
        .article(ArticleDto.fromEntity(ligneCommandeClient.getArticle()))
        .quantite(ligneCommandeClient.getQuantite())
        .prixUnitaire(ligneCommandeClient.getPrixUnitaire())
        .idEntreprise(ligneCommandeClient.getIdEntreprise())
        .build();
  }

  public static LigneCommandeClient toEntity(LigneCommandeClientDto dto) {
    if (dto == null) {
      return null;
    }

    LigneCommandeClient ligneCommandeClient = new LigneCommandeClient();
    ligneCommandeClient.setId(dto.getId());
    ligneCommandeClient.setArticle(ArticleDto.toEntity(dto.getArticle()));
    ligneCommandeClient.setPrixUnitaire(dto.getPrixUnitaire());
    ligneCommandeClient.setQuantite(dto.getQuantite());
    ligneCommandeClient.setIdEntreprise(dto.getIdEntreprise());
    return ligneCommandeClient;
  }

}
