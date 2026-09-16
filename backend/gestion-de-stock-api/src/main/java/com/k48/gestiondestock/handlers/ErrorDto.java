package com.k48.gestiondestock.handlers;

import com.k48.gestiondestock.exception.ErrorCodes;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "Erreur renvoyée par l'API")
public class ErrorDto {

  @Schema(description = "Code HTTP", example = "404")
  private Integer httpCode;

  @Schema(description = "Code d'erreur métier")
  private ErrorCodes code;

  @Schema(example = "Aucun article avec l'ID = 12 n' ete trouve dans la BDD")
  private String message;

  @Schema(description = "Détail des erreurs de validation")
  @Builder.Default
  private List<String> errors = new ArrayList<>();

}
