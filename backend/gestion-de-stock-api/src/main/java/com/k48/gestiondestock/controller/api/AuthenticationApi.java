package com.k48.gestiondestock.controller.api;

import static com.k48.gestiondestock.utils.Constants.AUTHENTICATION_ENDPOINT;

import com.k48.gestiondestock.dto.auth.AuthenticationRequest;
import com.k48.gestiondestock.dto.auth.AuthenticationResponse;
import io.swagger.annotations.Api;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Api("authentication")
public interface AuthenticationApi {

  @PostMapping(AUTHENTICATION_ENDPOINT + "/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request);

}
