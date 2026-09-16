package com.k48.gestiondestock.dto;

import com.k48.gestiondestock.model.LigneVente;
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
@Schema(description = "Ligne d'une vente")
public class LigneVenteDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(description = "Vente à laquelle appartient la ligne", accessMode = Schema.AccessMode.READ_ONLY)
  private VentesDto vente;

  @Schema(description = "Article vendu (seul son identifiant est nécessaire)")
  private ArticleDto article;

  @Schema(description = "Quantité vendue", example = "1")
  private BigDecimal quantite;

  @Schema(description = "Prix unitaire de vente", example = "11925")
  private BigDecimal prixUnitaire;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  public static LigneVenteDto fromEntity(LigneVente ligneVente) {
    if (ligneVente == null) {
      return null;
    }

    return LigneVenteDto.builder()
        .id(ligneVente.getId())
        .vente(VentesDto.fromEntity(ligneVente.getVente()))
        .article(ArticleDto.fromEntity(ligneVente.getArticle()))
        .quantite(ligneVente.getQuantite())
        .prixUnitaire(ligneVente.getPrixUnitaire())
        .idEntreprise(ligneVente.getIdEntreprise())
        .build();
  }

  public static LigneVente toEntity(LigneVenteDto dto) {
    if (dto == null) {
      return null;
    }
    LigneVente ligneVente = new LigneVente();
    ligneVente.setId(dto.getId());
    ligneVente.setVente(VentesDto.toEntity(dto.getVente()));
    ligneVente.setArticle(ArticleDto.toEntity(dto.getArticle()));
    ligneVente.setQuantite(dto.getQuantite());
    ligneVente.setPrixUnitaire(dto.getPrixUnitaire());
    ligneVente.setIdEntreprise(dto.getIdEntreprise());
    return ligneVente;
  }

}
