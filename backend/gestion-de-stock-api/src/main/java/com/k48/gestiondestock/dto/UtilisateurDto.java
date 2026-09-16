package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.k48.gestiondestock.model.Utilisateur;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Utilisateur de l'application")
public class UtilisateurDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(example = "Nono", requiredMode = Schema.RequiredMode.REQUIRED)
  private String nom;

  @Schema(description = "Prénom", example = "Leonel", requiredMode = Schema.RequiredMode.REQUIRED)
  private String prenom;

  @Schema(description = "Email, utilisé comme identifiant de connexion", example = "leonel@k48.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String email;

  @Schema(description = "Date de naissance (UTC)", example = "1995-05-20T00:00:00Z", requiredMode = Schema.RequiredMode.REQUIRED)
  private Instant dateDeNaissance;

  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  @Schema(description = "Mot de passe (jamais renvoyé dans les réponses)", example = "M0t-De-Passe", accessMode = Schema.AccessMode.WRITE_ONLY, requiredMode = Schema.RequiredMode.REQUIRED)
  private String moteDePasse;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private AdresseDto adresse;

  @Schema(description = "URL de la photo, renseignée par l'endpoint Photos (à renvoyer telle quelle lors d'une modification)")
  private String photo;

  @Schema(description = "Entreprise de rattachement (seul son identifiant est nécessaire)")
  private EntrepriseDto entreprise;

  @Schema(description = "Rôles de l'utilisateur", accessMode = Schema.AccessMode.READ_ONLY)
  private List<RolesDto> roles;

  public static UtilisateurDto fromEntity(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return null;
    }

    return UtilisateurDto.builder()
        .id(utilisateur.getId())
        .nom(utilisateur.getNom())
        .prenom(utilisateur.getPrenom())
        .email(utilisateur.getEmail())
        .moteDePasse(utilisateur.getMoteDePasse())
        .dateDeNaissance(utilisateur.getDateDeNaissance())
        .adresse(AdresseDto.fromEntity(utilisateur.getAdresse()))
        .photo(utilisateur.getPhoto())
        .entreprise(EntrepriseDto.fromEntity(utilisateur.getEntreprise()))
        .roles(
            utilisateur.getRoles() != null ?
                utilisateur.getRoles().stream()
                    .map(RolesDto::fromEntity)
                    .collect(Collectors.toList()) : null
        )
        .build();
  }

  public static Utilisateur toEntity(UtilisateurDto dto) {
    if (dto == null) {
      return null;
    }

    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setId(dto.getId());
    utilisateur.setNom(dto.getNom());
    utilisateur.setPrenom(dto.getPrenom());
    utilisateur.setEmail(dto.getEmail());
    utilisateur.setMoteDePasse(dto.getMoteDePasse());
    utilisateur.setDateDeNaissance(dto.getDateDeNaissance());
    utilisateur.setAdresse(AdresseDto.toEntity(dto.getAdresse()));
    utilisateur.setPhoto(dto.getPhoto());
    utilisateur.setEntreprise(EntrepriseDto.toEntity(dto.getEntreprise()));

    return utilisateur;
  }
}
