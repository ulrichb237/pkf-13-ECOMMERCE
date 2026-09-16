package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.k48.gestiondestock.model.Client;
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
@Schema(description = "Client de l'entreprise")
public class ClientDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(example = "Ngono", requiredMode = Schema.RequiredMode.REQUIRED)
  private String nom;

  @Schema(description = "Prénom", example = "Marie", requiredMode = Schema.RequiredMode.REQUIRED)
  private String prenom;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private AdresseDto adresse;

  @Schema(description = "URL de la photo, renseignée par l'endpoint Photos (à renvoyer telle quelle lors d'une modification)")
  private String photo;

  @Schema(description = "Adresse email", example = "marie.ngono@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String mail;

  @Schema(description = "Numéro de téléphone", example = "+237 690 00 00 00", requiredMode = Schema.RequiredMode.REQUIRED)
  private String numTel;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  @JsonIgnore
  private List<CommandeClientDto> commandeClients;

  public static ClientDto fromEntity(Client client) {
    if (client == null) {
      return null;
    }
    return ClientDto.builder()
        .id(client.getId())
        .nom(client.getNom())
        .prenom(client.getPrenom())
        .adresse(AdresseDto.fromEntity(client.getAdresse()))
        .photo(client.getPhoto())
        .mail(client.getMail())
        .numTel(client.getNumTel())
        .idEntreprise(client.getIdEntreprise())
        .build();
  }

  public static Client toEntity(ClientDto dto) {
    if (dto == null) {
      return null;
    }
    Client client = new Client();
    client.setId(dto.getId());
    client.setNom(dto.getNom());
    client.setPrenom(dto.getPrenom());
    client.setAdresse(AdresseDto.toEntity(dto.getAdresse()));
    client.setPhoto(dto.getPhoto());
    client.setMail(dto.getMail());
    client.setNumTel(dto.getNumTel());
    client.setIdEntreprise(dto.getIdEntreprise());
    return client;
  }

}
