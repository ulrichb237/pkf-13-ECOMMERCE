package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.k48.gestiondestock.model.Entreprise;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entreprise utilisatrice de l'application")
public class EntrepriseDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(example = "K48 Distribution", requiredMode = Schema.RequiredMode.REQUIRED)
  private String nom;

  @Schema(example = "Distribution de matériel informatique", requiredMode = Schema.RequiredMode.REQUIRED)
  private String description;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private AdresseDto adresse;

  @Schema(description = "Numéro d'identification fiscale", example = "M012345678901A", requiredMode = Schema.RequiredMode.REQUIRED)
  private String codeFiscal;

  @Schema(description = "URL du logo, renseignée par l'endpoint Photos (à renvoyer telle quelle lors d'une modification)")
  private String photo;

  @Schema(description = "Email de l'entreprise, utilisé comme identifiant de l'administrateur créé", example = "contact@k48.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String email;

  @Schema(description = "Numéro de téléphone", example = "+237 690 00 00 00", requiredMode = Schema.RequiredMode.REQUIRED)
  private String numTel;

  @Schema(description = "Site web", example = "https://www.k48.com")
  private String steWeb;

  /**
   * Mot de passe choisi par l'utilisateur pour le compte administrateur cree a l'inscription.
   * Transitoire : jamais persiste sur Entreprise, consomme puis efface par le service.
   * S'il est absent, l'ancien comportement (mot de passe par defaut) s'applique.
   */
  @Schema(description = "Mot de passe du compte administrateur (creation uniquement, 6 caracteres minimum). "
      + "Transitoire : jamais stocke sur l'entreprise.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  private String motDePasseAdmin;


  @JsonIgnore
  private List<UtilisateurDto> utilisateurs;

  public static EntrepriseDto fromEntity(Entreprise entreprise) {
    if (entreprise == null) {
      return null;
    }
    return EntrepriseDto.builder()
        .id(entreprise.getId())
        .nom(entreprise.getNom())
        .description(entreprise.getDescription())
        .adresse(AdresseDto.fromEntity(entreprise.getAdresse()))
        .codeFiscal(entreprise.getCodeFiscal())
        .photo(entreprise.getPhoto())
        .email(entreprise.getEmail())
        .numTel(entreprise.getNumTel())
        .steWeb(entreprise.getSteWeb())
        .build();
  }

  public static Entreprise toEntity(EntrepriseDto dto) {
    if (dto == null) {
      return null;
    }
    Entreprise entreprise = new Entreprise();
    entreprise.setId(dto.getId());
    entreprise.setNom(dto.getNom());
    entreprise.setDescription(dto.getDescription());
    entreprise.setAdresse(AdresseDto.toEntity(dto.getAdresse()));
    entreprise.setCodeFiscal(dto.getCodeFiscal());
    entreprise.setPhoto(dto.getPhoto());
    entreprise.setEmail(dto.getEmail());
    entreprise.setNumTel(dto.getNumTel());
    entreprise.setSteWeb(dto.getSteWeb());

    return entreprise;
  }

}
