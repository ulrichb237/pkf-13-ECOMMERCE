package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.PHOTOS_ENDPOINT;

import com.flickr4java.flickr.FlickrException;
import com.k48.gestiondestock.handlers.ErrorDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Photos", description = "Envoi de photos (hébergées sur Flickr) pour les articles, clients, fournisseurs, entreprises et utilisateurs")
public interface PhotoApi {

  @PostMapping(value = PHOTOS_ENDPOINT + "/{contexte}/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Enregistrer la photo d'un objet",
      description = "Envoie le fichier sur Flickr puis enregistre l'URL obtenue dans l'objet ciblé, qui est renvoyé à jour.")
  @ApiResponse(responseCode = "200", description = "Objet mis à jour avec l'URL de sa photo")
  @ApiResponse(responseCode = "400", description = "Contexte inconnu ou échec de l'envoi sur Flickr",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  @ApiResponse(responseCode = "404", description = "Aucun objet avec cet identifiant dans ce contexte",
      content = @Content(schema = @Schema(implementation = ErrorDto.class)))
  Object savePhoto(
      @Parameter(description = "Type d'objet auquel rattacher la photo",
          schema = @Schema(allowableValues = {"article", "client", "fournisseur", "entreprise", "utilisateur"}))
      @PathVariable("contexte") String contexte,
      @Parameter(description = "Identifiant de l'objet", example = "1") @PathVariable("id") Integer id,
      @Parameter(description = "Titre de la photo sur Flickr", example = "Photo article ART-001") @RequestParam("titre") String titre,
      @Parameter(description = "Fichier image à envoyer") @RequestPart("fichier") MultipartFile fichier) throws IOException, FlickrException;

}
