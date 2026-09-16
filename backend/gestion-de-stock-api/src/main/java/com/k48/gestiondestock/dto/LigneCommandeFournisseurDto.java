package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.k48.gestiondestock.model.CommandeFournisseur;
import com.k48.gestiondestock.model.LigneCommandeFournisseur;
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
@Schema(description = "Ligne d'une commande fournisseur")
public class LigneCommandeFournisseurDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(description = "Article commandé (seul son identifiant est nécessaire)")
  private ArticleDto article;

  @JsonIgnore
  private CommandeFournisseur commandeFournisseur;

  @Schema(description = "Quantité commandée", example = "10")
  private BigDecimal quantite;

  @Schema(description = "Prix unitaire d'achat", example = "8000")
  private BigDecimal prixUnitaire;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  public static LigneCommandeFournisseurDto fromEntity(LigneCommandeFournisseur ligneCommandeFournisseur) {
    if (ligneCommandeFournisseur == null) {
      return null;
    }
    return LigneCommandeFournisseurDto.builder()
        .id(ligneCommandeFournisseur.getId())
        .article(ArticleDto.fromEntity(ligneCommandeFournisseur.getArticle()))
        .quantite(ligneCommandeFournisseur.getQuantite())
        .prixUnitaire(ligneCommandeFournisseur.getPrixUnitaire())
        .idEntreprise(ligneCommandeFournisseur.getIdEntreprise())
        .build();
  }

  public static LigneCommandeFournisseur toEntity(LigneCommandeFournisseurDto dto) {
    if (dto == null) {
      return null;
    }

    LigneCommandeFournisseur ligneCommandeFournisseur = new LigneCommandeFournisseur();
    ligneCommandeFournisseur.setId(dto.getId());
    ligneCommandeFournisseur.setArticle(ArticleDto.toEntity(dto.getArticle()));
    ligneCommandeFournisseur.setPrixUnitaire(dto.getPrixUnitaire());
    ligneCommandeFournisseur.setQuantite(dto.getQuantite());
    ligneCommandeFournisseur.setIdEntreprise(dto.getIdEntreprise());
    return ligneCommandeFournisseur;
  }

}
