package com.k48.gestiondestock.repository;

import com.k48.gestiondestock.model.Article;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Integer> {

  Optional<Article> findArticleByCodeArticle(String codeArticle);

  List<Article> findAllByCategoryId(Integer idCategory);

  /** Dernier code insere, pour le sequenceur des codes auto-genres */
  Optional<Article> findTopByCodeArticleStartingWithOrderByIdDesc(String prefixe);

}
