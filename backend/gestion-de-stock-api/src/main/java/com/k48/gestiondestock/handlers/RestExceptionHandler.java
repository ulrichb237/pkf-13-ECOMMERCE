package com.k48.gestiondestock.handlers;

import com.k48.gestiondestock.exception.EntityNotFoundException;
import com.k48.gestiondestock.exception.ErrorCodes;
import com.k48.gestiondestock.exception.InvalidEntityException;
import com.k48.gestiondestock.exception.InvalidOperationException;
import java.util.Collections;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.util.ClassUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;


@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<ErrorDto> handleException(EntityNotFoundException exception, WebRequest webRequest) {

    final HttpStatus notFound = HttpStatus.NOT_FOUND;
    final ErrorDto errorDto = ErrorDto.builder()
        .code(exception.getErrorCode())
        .httpCode(notFound.value())
        .message(exception.getMessage())
        .build();

    return new ResponseEntity<>(errorDto, notFound);
  }

  @ExceptionHandler(InvalidOperationException.class)
  public ResponseEntity<ErrorDto> handleException(InvalidOperationException exception, WebRequest webRequest) {

    final HttpStatus notFound = HttpStatus.BAD_REQUEST;
    final ErrorDto errorDto = ErrorDto.builder()
        .code(exception.getErrorCode())
        .httpCode(notFound.value())
        .message(exception.getMessage())
        .build();

    return new ResponseEntity<>(errorDto, notFound);
  }

  @ExceptionHandler(InvalidEntityException.class)
  public ResponseEntity<ErrorDto> handleException(InvalidEntityException exception, WebRequest webRequest) {
    final HttpStatus badRequest = HttpStatus.BAD_REQUEST;

    final ErrorDto errorDto = ErrorDto.builder()
        .code(exception.getErrorCode())
        .httpCode(badRequest.value())
        .message(exception.getMessage())
        .errors(exception.getErrors())
        .build();

    return new ResponseEntity<>(errorDto, badRequest);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorDto> handleException(BadCredentialsException exception, WebRequest webRequest) {
    final HttpStatus badRequest = HttpStatus.BAD_REQUEST;

    final ErrorDto errorDto = ErrorDto.builder()
        .code(ErrorCodes.BAD_CREDENTIALS)
        .httpCode(badRequest.value())
        .message(exception.getMessage())
        .errors(Collections.singletonList("Login et / ou mot de passe incorrecte"))
        .build();

    return new ResponseEntity<>(errorDto, badRequest);
  }

  // Un "id" est envoye pour un objet qui n'existe pas (souvent "id": 0 ou 1 laisse dans un exemple) :
  // Hibernate tente une modification et ne trouve pas la ligne
  @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
  public ResponseEntity<ErrorDto> handleException(ObjectOptimisticLockingFailureException exception, WebRequest webRequest) {
    final HttpStatus notFound = HttpStatus.NOT_FOUND;
    final String entite = exception.getPersistentClassName() != null
        ? ClassUtils.getShortName(exception.getPersistentClassName()) : "demande";

    final ErrorDto errorDto = ErrorDto.builder()
        .code(ErrorCodes.ENTITY_NOT_FOUND)
        .httpCode(notFound.value())
        .message("Aucun objet " + entite + " avec l'identifiant " + exception.getIdentifier() + " n'existe dans la BDD")
        .errors(Collections.singletonList("Pour une creation, ne pas envoyer le champ id"))
        .build();

    return new ResponseEntity<>(errorDto, notFound);
  }

  // Contrainte de la base violee, par exemple la suppression d'un objet encore reference par d'autres donnees
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorDto> handleException(DataIntegrityViolationException exception, WebRequest webRequest) {
    final HttpStatus badRequest = HttpStatus.BAD_REQUEST;

    final ErrorDto errorDto = ErrorDto.builder()
        .code(ErrorCodes.ENTITY_ALREADY_IN_USE)
        .httpCode(badRequest.value())
        .message("Operation impossible : l'objet est lie a d'autres donnees ou ne respecte pas une contrainte de la BDD")
        .build();

    return new ResponseEntity<>(errorDto, badRequest);
  }

}
