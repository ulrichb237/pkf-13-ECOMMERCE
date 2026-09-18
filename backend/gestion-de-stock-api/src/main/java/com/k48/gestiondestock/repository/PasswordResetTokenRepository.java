package com.k48.gestiondestock.repository;

import com.k48.gestiondestock.model.PasswordResetToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {

  Optional<PasswordResetToken> findByToken(String token);

  Optional<PasswordResetToken> findByUtilisateurId(Integer utilisateurId);
}
