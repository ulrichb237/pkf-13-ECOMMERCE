package com.k48.gestiondestock.repository;

import com.k48.gestiondestock.model.CommandeClient;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeClientRepository extends JpaRepository<CommandeClient, Integer> {

  Optional<CommandeClient> findCommandeClientByCode(String code);

  List<CommandeClient> findAllByClientId(Integer id);

  /** Dernier code insere, pour le sequenceur des codes auto-genres */
  Optional<CommandeClient> findTopByCodeStartingWithOrderByIdDesc(String prefixe);
}
