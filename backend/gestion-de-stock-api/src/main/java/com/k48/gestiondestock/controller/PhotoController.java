package com.k48.gestiondestock.controller;

import com.k48.gestiondestock.controller.api.PhotoApi;
import com.k48.gestiondestock.services.strategy.StrategyPhotoContext;
import com.flickr4java.flickr.FlickrException;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class PhotoController implements PhotoApi {

  private StrategyPhotoContext strategyPhotoContext;

  @Autowired
  public PhotoController(StrategyPhotoContext strategyPhotoContext) {
    this.strategyPhotoContext = strategyPhotoContext;
  }

  @Override
  public Object savePhoto(String contexte, Integer id, String titre, MultipartFile fichier) throws IOException, FlickrException {
    return strategyPhotoContext.savePhoto(contexte, id, fichier.getInputStream(), titre);
  }
}
