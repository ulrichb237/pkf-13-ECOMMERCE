package com.k48.gestiondestock.repository;

import com.k48.gestiondestock.model.Ventes;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VentesRepository extends JpaRepository<Ventes, Integer> {

  Optional<Ventes> findVentesByCode(String code);

  /** Dernier code insere, pour le sequenceur des codes auto-genres */
  Optional<Ventes> findTopByCodeStartingWithOrderByIdDesc(String prefixe);
}
