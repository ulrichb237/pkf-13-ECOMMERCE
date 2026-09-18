package com.k48.gestiondestock.services.auth;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.k48.gestiondestock.exception.EntityNotFoundException;
import com.k48.gestiondestock.exception.InvalidOperationException;
import com.k48.gestiondestock.model.PasswordResetToken;
import com.k48.gestiondestock.model.Utilisateur;
import com.k48.gestiondestock.repository.PasswordResetTokenRepository;
import com.k48.gestiondestock.repository.UtilisateurRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Gestion du cycle "mot de passe oublie / reinitialisation" :
 * - demande : generation d'un jeton numerique a duree de vie courte (15 min), usage unique
 * - confirmation : verification du jeton puis remplacement du mot de passe
 *
 * Le jeton est retourne directement dans la reponse : le projet n'a pas de serveur SMTP
 * configure (voir MODIFICATIONS_BACKEND.md), l'UI le transmet a l'utilisateur.
 * Lorsqu'un service mail sera branche, il suffira d'envoyer le jeton par mail
 * dans forgotPassword() au lieu de le renvoyer dans la reponse.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PasswordResetService {

  private static final int TOKEN_VALIDITY_MINUTES = 15;

  private final PasswordResetTokenRepository tokenRepository;
  private final UtilisateurRepository utilisateurRepository;
  private final PasswordEncoder passwordEncoder;

  /**
   * Etape 1 : l'utilisateur demande une reinitialisation pour son email.
   * Reponse volontairement identique que l'email existe ou non (anti-enumeration),
   * mais si l'utilisateur existe un jeton est genere et renvoye pour l'UI.
   */
  @Transactional
  public String demandReinitialisation(String email) {
    final Utilisateur utilisateur = utilisateurRepository.findUtilisateurByEmail(email).orElse(null);
    if (utilisateur == null) {
      log.warn("Demande de reinitialisation pour un email inconnu : {}", email);
      return null;
    }
    // Invalide les jetons precedents de cet utilisateur
    tokenRepository.findByUtilisateurId(utilisateur.getId())
        .ifPresent(tokenRepository::delete);

    final String code = genererCode();
    tokenRepository.save(PasswordResetToken.builder()
        .token(code)
        .utilisateur(utilisateur)
        .expiration(Instant.now().plus(TOKEN_VALIDITY_MINUTES, ChronoUnit.MINUTES))
        .build());
    log.info("Jeton de reinitialisation genere pour {} (valide {} min)", email, TOKEN_VALIDITY_MINUTES);
    return code;
  }

  /**
   * Etape 2 : l'utilisateur fournit le jeton + son nouveau mot de passe.
   */
  @Transactional
  public void confirmerReinitialisation(String token, String nouveauMotDePasse) {
    final PasswordResetToken resetToken = tokenRepository.findByToken(token)
        .orElseThrow(() -> new EntityNotFoundException("Code de reinitialisation invalide"));
    if (resetToken.getExpiration().isBefore(Instant.now())) {
      tokenRepository.delete(resetToken);
      throw new InvalidOperationException("Code de reinitialisation expire, demandez-en un nouveau");
    }
    if (nouveauMotDePasse == null || nouveauMotDePasse.length() < 6) {
      throw new InvalidOperationException("Le mot de passe doit contenir au moins 6 caracteres");
    }
    final Utilisateur utilisateur = resetToken.getUtilisateur();
    utilisateur.setMoteDePasse(passwordEncoder.encode(nouveauMotDePasse));
    utilisateurRepository.save(utilisateur);
    tokenRepository.delete(resetToken);
    log.info("Mot de passe reinitialise avec succes pour {}", utilisateur.getEmail());
  }

  private String genererCode() {
    return String.format("%06d", new java.security.SecureRandom().nextInt(1_000_000));
  }

  @SuppressWarnings("unused")
  private static List<String> interdireMotsDePasseFaibles() {
    return List.of(); // reserve pour une future politique de mots de passe
  }
}
