package com.k48.gestiondestock.services.auth;

import com.k48.gestiondestock.exception.ErrorCodes;
import com.k48.gestiondestock.exception.InvalidOperationException;
import com.k48.gestiondestock.model.RefreshToken;
import com.k48.gestiondestock.repository.RefreshTokenRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Gestion des jetons de renouvellement :
 * - un seul jeton actif par utilisateur (rotation a chaque connexion) ;
 * - expiration a 7 jours ;
 * - revocation a la deconnexion ou lors d'une rotation.
 */
@Service
@Slf4j
public class RefreshTokenService {

  private final RefreshTokenRepository refreshTokenRepository;

  @Value("${jwt.refresh-expiration-days:7}")
  private long dureeJours;

  public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  /** Cree un jeton et revoque le precedent de l'utilisateur (rotation) */
  @Transactional
  public RefreshToken creer(Integer idUtilisateur) {
    refreshTokenRepository.revokeByIdUtilisateur(idUtilisateur);
    RefreshToken token = RefreshToken.builder()
        .idUtilisateur(idUtilisateur)
        .dateExpiration(Instant.now().plus(dureeJours, ChronoUnit.DAYS))
        .build();
    return refreshTokenRepository.save(token);
  }

  /** Valide le jeton fourni et renvoie l'utilisateur propriétaire */
  @Transactional(readOnly = true)
  public RefreshToken valider(String jeton) {
    if (jeton == null || jeton.isBlank()) {
      throw new InvalidOperationException("Refresh token manquant", null, ErrorCodes.BAD_CREDENTIALS);
    }
    RefreshToken token = refreshTokenRepository.findByJeton(jeton)
        .orElseThrow(() -> new InvalidOperationException("Refresh token inconnu", ErrorCodes.BAD_CREDENTIALS));
    if (!token.estValide()) {
      refreshTokenRepository.delete(token);
      throw new InvalidOperationException("Refresh token expire : veuillez vous reconnecter", null, ErrorCodes.BAD_CREDENTIALS);
    }
    return token;
  }

  /** Deconnexion : supprime le jeton fourni (s'il existe) */
  @Transactional
  public void revoquer(String jeton) {
    if (jeton == null || jeton.isBlank()) {
      return;
    }
    Optional<RefreshToken> token = refreshTokenRepository.findByJeton(jeton);
    token.ifPresent(refreshTokenRepository::delete);
  }

  /** Deconnexion de tous les appareils */
  @Transactional
  public void revoquerPourUtilisateur(Integer idUtilisateur) {
    refreshTokenRepository.revokeByIdUtilisateur(idUtilisateur);
  }
}
