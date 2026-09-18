package com.k48.gestiondestock.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Jeton de renouvellement (refresh token) : opaques (UUID), uniques et
 * revocables. Persistes pour permettre la deconnexion (suppression) et
 * l'expiration (7 jours). Un seul actif par utilisateur : la reconnexion
 * revoque le precedent (rotation).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refreshtoken")
public class RefreshToken {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "jeton", nullable = false, unique = true, length = 64)
  private String jeton;

  @Column(name = "idutilisateur", nullable = false)
  private Integer idUtilisateur;

  @Column(name = "dateexpiration", nullable = false)
  private Instant dateExpiration;

  @Column(name = "datedecreation", nullable = false, updatable = false)
  private Instant dateDeCreation;

  @PrePersist
  void onCreate() {
    this.dateDeCreation = Instant.now();
    if (this.jeton == null) {
      this.jeton = UUID.randomUUID().toString().replace("-", "");
  }
  }

  /** Le jeton est-il utilisable ? */
  public boolean estValide() {
    return dateExpiration != null && dateExpiration.isAfter(Instant.now());
  }
}
