package com.k48.gestiondestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.k48.gestiondestock.model.CommandeClient;
import com.k48.gestiondestock.model.EtatCommande;
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
@Schema(description = "Commande passée par un client")
public class CommandeClientDto {

  @Schema(description = "Identifiant (laisser vide pour une création)", example = "1")
  private Integer id;

  @Schema(description = "Code unique de la commande", example = "CC-2026-001", requiredMode = Schema.RequiredMode.REQUIRED)
  private String code;

  @Schema(description = "Date de la commande (UTC)", example = "2026-09-16T10:00:00Z", requiredMode = Schema.RequiredMode.REQUIRED)
  private Instant dateCommande;

  @Schema(description = "État de la commande", requiredMode = Schema.RequiredMode.REQUIRED)
  private EtatCommande etatCommande;

  @Schema(description = "Client qui passe la commande (seul son identifiant est nécessaire)", requiredMode = Schema.RequiredMode.REQUIRED)
  private ClientDto client;

  @Schema(description = "Identifiant de l'entreprise propriétaire", example = "1")
  private Integer idEntreprise;

  @Schema(description = "Lignes de la commande")
  private List<LigneCommandeClientDto> ligneCommandeClients;

  public static CommandeClientDto fromEntity(CommandeClient commandeClient) {
    if (commandeClient == null) {
      return null;
    }
    return CommandeClientDto.builder()
        .id(commandeClient.getId())
        .code(commandeClient.getCode())
        .dateCommande(commandeClient.getDateCommande())
        .etatCommande(commandeClient.getEtatCommande())
        .client(ClientDto.fromEntity(commandeClient.getClient()))
        .idEntreprise(commandeClient.getIdEntreprise())
        .build();

  }

  public static CommandeClient toEntity(CommandeClientDto dto) {
    if (dto == null) {
      return null;
    }
    CommandeClient commandeClient = new CommandeClient();
    commandeClient.setId(dto.getId());
    commandeClient.setCode(dto.getCode());
    commandeClient.setClient(ClientDto.toEntity(dto.getClient()));
    commandeClient.setDateCommande(dto.getDateCommande());
    commandeClient.setEtatCommande(dto.getEtatCommande());
    commandeClient.setIdEntreprise(dto.getIdEntreprise());
    return commandeClient;
  }

  public boolean isCommandeLivree() {
    return EtatCommande.LIVREE.equals(this.etatCommande);
  }
}
