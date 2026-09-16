package com.k48.gestiondestock.dto;

import com.k48.gestiondestock.model.Adresse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Adresse postale")
public class AdresseDto {

  @Schema(description = "Numéro et rue", example = "12 rue des Palmiers", requiredMode = Schema.RequiredMode.REQUIRED)
  private String adresse1;

  @Schema(description = "Complément d'adresse", example = "Bâtiment B")
  private String adresse2;

  @Schema(example = "Douala", requiredMode = Schema.RequiredMode.REQUIRED)
  private String ville;

  @Schema(description = "Code postal", example = "00237")
  private String codePostale;

  @Schema(example = "Cameroun", requiredMode = Schema.RequiredMode.REQUIRED)
  private String pays;

  public static AdresseDto fromEntity(Adresse adresse) {
    if (adresse == null) {
      return null;
    }

    return AdresseDto.builder()
        .adresse1(adresse.getAdresse1())
        .adresse2(adresse.getAdresse2())
        .codePostale(adresse.getCodePostale())
        .ville(adresse.getVille())
        .pays(adresse.getPays())
        .build();
  }

  public static Adresse toEntity(AdresseDto adresseDto) {
    if (adresseDto == null) {
      return null;
    }
    Adresse adresse = new Adresse();
    adresse.setAdresse1(adresseDto.getAdresse1());
    adresse.setAdresse2(adresseDto.getAdresse2());
    adresse.setCodePostale(adresseDto.getCodePostale());
    adresse.setVille(adresseDto.getVille());
    adresse.setPays(adresseDto.getPays());
    return adresse;
  }

}
