package com.k48.gestiondestock.repository;

import com.k48.gestiondestock.model.Category;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

  Optional<Category> findCategoryByCode(String code);

  /** Dernier code insere, pour le sequenceur des codes auto-genres */
  Optional<Category> findTopByCodeStartingWithOrderByIdDesc(String prefixe);

}
