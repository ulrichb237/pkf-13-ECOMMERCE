package com.k48.gestiondestock.repository;

import com.k48.gestiondestock.model.RefreshToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {

  Optional<RefreshToken> findByJeton(String jeton);

  Optional<RefreshToken> findByIdUtilisateur(Integer idUtilisateur);

  /** Révoque (supprime) le jeton d'un utilisateur : déconnexion ou rotation */
  @Modifying
  @Query("delete from RefreshToken r where r.idUtilisateur = :idUtilisateur")
  void revokeByIdUtilisateur(@Param("idUtilisateur") Integer idUtilisateur);
}
