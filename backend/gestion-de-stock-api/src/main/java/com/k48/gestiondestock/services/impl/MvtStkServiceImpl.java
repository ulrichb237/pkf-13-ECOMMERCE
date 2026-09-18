package com.k48.gestiondestock.services.impl;

import com.k48.gestiondestock.dto.ArticleDto;
import com.k48.gestiondestock.dto.MvtStkDto;
import com.k48.gestiondestock.exception.ErrorCodes;
import com.k48.gestiondestock.exception.InvalidEntityException;
import com.k48.gestiondestock.model.TypeMvtStk;
import com.k48.gestiondestock.repository.MvtStkRepository;
import com.k48.gestiondestock.services.ArticleService;
import com.k48.gestiondestock.services.MvtStkService;
import com.k48.gestiondestock.validator.MvtStkValidator;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MvtStkServiceImpl implements MvtStkService {

  private MvtStkRepository repository;
  private ArticleService articleService;

  @Autowired
  public MvtStkServiceImpl(MvtStkRepository repository, ArticleService articleService) {
    this.repository = repository;
    this.articleService = articleService;
  }

  @Override
  public BigDecimal stockReelArticle(Integer idArticle) {
    if (idArticle == null) {
      log.warn("ID article is NULL");
      return BigDecimal.valueOf(-1);
    }
    articleService.findById(idArticle);
    // Sans mouvement, la somme SQL vaut NULL : le stock est alors de 0
    return Optional.ofNullable(repository.stockReelArticle(idArticle)).orElse(BigDecimal.ZERO);
  }

  @Override
  public List<MvtStkDto> mvtStkArticle(Integer idArticle) {
    return repository.findAllByArticleId(idArticle).stream()
        .map(MvtStkDto::fromEntity)
        .collect(Collectors.toList());
  }

  @Override
  public MvtStkDto entreeStock(MvtStkDto dto) {
    return entreePositive(dto, TypeMvtStk.ENTREE);
  }

  @Override
  public MvtStkDto sortieStock(MvtStkDto dto) {
    return sortieNegative(dto, TypeMvtStk.SORTIE);
  }

  @Override
  public MvtStkDto correctionStockPos(MvtStkDto dto) {
    return entreePositive(dto, TypeMvtStk.CORRECTION_POS);
  }

  @Override
  public MvtStkDto correctionStockNeg(MvtStkDto dto) {
    return sortieNegative(dto, TypeMvtStk.CORRECTION_NEG);
  }

  private MvtStkDto entreePositive(MvtStkDto dto, TypeMvtStk typeMvtStk) {
    List<String> errors = MvtStkValidator.validate(dto);
    if (!errors.isEmpty()) {
      log.error("Article is not valid {}", dto);
      throw new InvalidEntityException("Le mouvement du stock n'est pas valide", ErrorCodes.MVT_STK_NOT_VALID, errors);
    }
    // Propagation de l'entreprise : sans elle, le filtre multi-entreprise
    // (EntrepriseStatementInspector) rend le mouvement invisible a toutes les
    // lectures (stock reel faux, historique vide). L'article lie au mouvement
    // est recharge en base pour retrouver l'entreprise qui le possede.
    if (dto.getIdEntreprise() == null && dto.getArticle() != null && dto.getArticle().getId() != null) {
      final ArticleDto article = articleService.findById(dto.getArticle().getId());
      if (article != null && article.getIdEntreprise() != null) {
        dto.setIdEntreprise(article.getIdEntreprise());
      }
    }
    dto.setQuantite(
        BigDecimal.valueOf(
            Math.abs(dto.getQuantite().doubleValue())
        )
    );
    dto.setTypeMvt(typeMvtStk);
    return MvtStkDto.fromEntity(
        repository.save(MvtStkDto.toEntity(dto))
    );
  }

  private MvtStkDto sortieNegative(MvtStkDto dto, TypeMvtStk typeMvtStk) {
    List<String> errors = MvtStkValidator.validate(dto);
    if (!errors.isEmpty()) {
      log.error("Article is not valid {}", dto);
      throw new InvalidEntityException("Le mouvement du stock n'est pas valide", ErrorCodes.MVT_STK_NOT_VALID, errors);
    }
    // Symetrique de l'entree : cf. commentaire ci-dessus (filtre multi-entreprise)
    if (dto.getIdEntreprise() == null && dto.getArticle() != null && dto.getArticle().getId() != null) {
      final ArticleDto article = articleService.findById(dto.getArticle().getId());
      if (article != null && article.getIdEntreprise() != null) {
        dto.setIdEntreprise(article.getIdEntreprise());
      }
    }
    dto.setQuantite(
        BigDecimal.valueOf(
            Math.abs(dto.getQuantite().doubleValue()) * -1
        )
    );
    dto.setTypeMvt(typeMvtStk);
    return MvtStkDto.fromEntity(
        repository.save(MvtStkDto.toEntity(dto))
    );
  }
}
