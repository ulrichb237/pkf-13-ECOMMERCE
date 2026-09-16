package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.k48.gestiondestock.model.Roles;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Rôle attribué à un utilisateur")
public class RolesDto {

  @Schema(description = "Identifiant", example = "1")
  private Integer id;

  @Schema(description = "Nom du rôle", example = "ADMIN")
  private String roleName;

  @JsonIgnore
  private UtilisateurDto utilisateur;

  public static RolesDto fromEntity(Roles roles) {
    if (roles == null) {
      return null;
    }
    return RolesDto.builder()
        .id(roles.getId())
        .roleName(roles.getRoleName())
        .build();
  }

  public static Roles toEntity(RolesDto dto) {
    if (dto == null) {
      return null;
    }
    Roles roles = new Roles();
    roles.setId(dto.getId());
    roles.setRoleName(dto.getRoleName());
    roles.setUtilisateur(UtilisateurDto.toEntity(dto.getUtilisateur()));
    return roles;
  }

}
