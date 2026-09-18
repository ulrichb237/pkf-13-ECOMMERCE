package com.k48.gestiondestock.validator;

import com.k48.gestiondestock.dto.CategoryDto;
import java.util.ArrayList;
import java.util.List;
import org.springframework.util.StringUtils;

public class CategoryValidator {

  public static List<String> validate(CategoryDto categoryDto) {
    List<String> errors = new ArrayList<>();

    if (categoryDto == null || !StringUtils.hasLength(categoryDto.getCode())) {
      // Code genere automatiquement par le backend (CodeGenerator) : plus obligatoire
      // errors.add("Veuillez renseigner le code de la categorie");
    }
    return errors;
  }

}
