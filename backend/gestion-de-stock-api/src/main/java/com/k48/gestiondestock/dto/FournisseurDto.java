package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.k48.gestiondestock.model.Fournisseur;
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
@Schema(description = "Fournisseur de l'entreprise")
public class FournisseurDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(example = "Tchoumi", requiredMode = Schema.RequiredMode.REQUIRED)
  private String nom;

  @Schema(description = "Prénom", example = "Paul", requiredMode = Schema.RequiredMode.REQUIRED)
  private String prenom;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private AdresseDto adresse;

  @Schema(description = "URL de la photo, renseignée par l'endpoint Photos (à renvoyer telle quelle lors d'une modification)")
  private String photo;

  @Schema(description = "Adresse email", example = "paul.tchoumi@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String mail;

  @Schema(description = "Numéro de téléphone", example = "+237 677 00 00 00", requiredMode = Schema.RequiredMode.REQUIRED)
  private String numTel;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  @JsonIgnore
  private List<CommandeFournisseurDto> commandeFournisseurs;

  public static FournisseurDto fromEntity(Fournisseur fournisseur) {
    if (fournisseur == null) {
      return null;
    }
    return FournisseurDto.builder()
        .id(fournisseur.getId())
        .nom(fournisseur.getNom())
        .prenom(fournisseur.getPrenom())
        .adresse(AdresseDto.fromEntity(fournisseur.getAdresse()))
        .photo(fournisseur.getPhoto())
        .mail(fournisseur.getMail())
        .numTel(fournisseur.getNumTel())
        .idEntreprise(fournisseur.getIdEntreprise())
        .build();
  }

  public static Fournisseur toEntity(FournisseurDto dto) {
    if (dto == null) {
      return null;
    }
    Fournisseur fournisseur = new Fournisseur();
    fournisseur.setId(dto.getId());
    fournisseur.setNom(dto.getNom());
    fournisseur.setPrenom(dto.getPrenom());
    fournisseur.setAdresse(AdresseDto.toEntity(dto.getAdresse()));
    fournisseur.setPhoto(dto.getPhoto());
    fournisseur.setMail(dto.getMail());
    fournisseur.setNumTel(dto.getNumTel());
    fournisseur.setIdEntreprise(dto.getIdEntreprise());

    return fournisseur;
  }
}
