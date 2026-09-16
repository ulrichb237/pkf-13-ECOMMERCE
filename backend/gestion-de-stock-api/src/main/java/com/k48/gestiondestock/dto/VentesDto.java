package com.k48.gestiondestock.dto;

import com.k48.gestiondestock.model.Ventes;
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
@Schema(description = "Vente directe")
public class VentesDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(description = "Code unique de la vente", example = "V-2026-001", requiredMode = Schema.RequiredMode.REQUIRED)
  private String code;

  @Schema(description = "Date de la vente (UTC)", example = "2026-09-16T10:00:00Z", requiredMode = Schema.RequiredMode.REQUIRED)
  private Instant dateVente;

  @Schema(example = "Vente comptoir")
  private String commentaire;

  @Schema(description = "Lignes de la vente")
  private List<LigneVenteDto> ligneVentes;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  public static VentesDto fromEntity(Ventes vente) {
    if (vente == null) {
      return null;
    }
    return VentesDto.builder()
        .id(vente.getId())
        .code(vente.getCode())
        .dateVente(vente.getDateVente())
        .commentaire(vente.getCommentaire())
        .idEntreprise(vente.getIdEntreprise())
        .build();
  }

  public static Ventes toEntity(VentesDto dto) {
    if (dto == null) {
      return null;
    }
    Ventes ventes = new Ventes();
    ventes.setId(dto.getId());
    ventes.setCode(dto.getCode());
    ventes.setDateVente(dto.getDateVente());
    ventes.setCommentaire(dto.getCommentaire());
    ventes.setIdEntreprise(dto.getIdEntreprise());
    return ventes;
  }
}
