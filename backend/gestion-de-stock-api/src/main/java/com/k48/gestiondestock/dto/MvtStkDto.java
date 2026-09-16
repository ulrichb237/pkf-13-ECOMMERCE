package com.k48.gestiondestock.dto;

import com.k48.gestiondestock.model.MvtStk;
import com.k48.gestiondestock.model.SourceMvtStk;
import com.k48.gestiondestock.model.TypeMvtStk;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Mouvement de stock d'un article")
public class MvtStkDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(description = "Date du mouvement (UTC)", example = "2026-09-16T10:00:00Z", requiredMode = Schema.RequiredMode.REQUIRED)
  private Instant dateMvt;

  @Schema(description = "Quantité déplacée (le signe est fixé par l'endpoint appelé)", example = "5", requiredMode = Schema.RequiredMode.REQUIRED)
  private BigDecimal quantite;

  @Schema(description = "Article concerné (seul son identifiant est nécessaire)", requiredMode = Schema.RequiredMode.REQUIRED)
  private ArticleDto article;

  @Schema(description = "Type de mouvement : obligatoire, mais remplacé par le type correspondant à l'endpoint appelé", requiredMode = Schema.RequiredMode.REQUIRED)
  private TypeMvtStk typeMvt;

  @Schema(description = "Origine du mouvement")
  private SourceMvtStk sourceMvt;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  public static MvtStkDto fromEntity(MvtStk mvtStk) {
    if (mvtStk == null) {
      return null;
    }

    return MvtStkDto.builder()
        .id(mvtStk.getId())
        .dateMvt(mvtStk.getDateMvt())
        .quantite(mvtStk.getQuantite())
        .article(ArticleDto.fromEntity(mvtStk.getArticle()))
        .typeMvt(mvtStk.getTypeMvt())
        .sourceMvt(mvtStk.getSourceMvt())
        .idEntreprise(mvtStk.getIdEntreprise())
        .build();
  }

  public static MvtStk toEntity(MvtStkDto dto) {
    if (dto == null) {
      return null;
    }

    MvtStk mvtStk = new MvtStk();
    mvtStk.setId(dto.getId());
    mvtStk.setDateMvt(dto.getDateMvt());
    mvtStk.setQuantite(dto.getQuantite());
    mvtStk.setArticle(ArticleDto.toEntity(dto.getArticle()));
    mvtStk.setTypeMvt(dto.getTypeMvt());
    mvtStk.setSourceMvt(dto.getSourceMvt());
    mvtStk.setIdEntreprise(dto.getIdEntreprise());
    return mvtStk;
  }
}
