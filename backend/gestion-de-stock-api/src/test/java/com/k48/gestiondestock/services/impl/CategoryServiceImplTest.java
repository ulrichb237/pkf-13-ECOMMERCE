package com.k48.gestiondestock.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.k48.gestiondestock.dto.CategoryDto;
import com.k48.gestiondestock.exception.EntityNotFoundException;
import com.k48.gestiondestock.exception.ErrorCodes;
import com.k48.gestiondestock.exception.InvalidEntityException;
import com.k48.gestiondestock.services.CategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CategoryServiceImplTest {

  @Autowired
  private CategoryService service;

  @Test
  void shouldSaveCategoryWithSuccess() {
    CategoryDto expectedCategory = CategoryDto.builder()
        .code("Cat test")
        .designation("Designation test")
        .idEntreprise(1)
        .build();

    CategoryDto savedCategory = service.save(expectedCategory);

    assertNotNull(savedCategory);
    assertNotNull(savedCategory.getId());
    assertEquals(expectedCategory.getCode(), savedCategory.getCode());
    assertEquals(expectedCategory.getDesignation(), savedCategory.getDesignation());
    assertEquals(expectedCategory.getIdEntreprise(), savedCategory.getIdEntreprise());
  }

  @Test
  void shouldUpdateCategoryWithSuccess() {
    CategoryDto expectedCategory = CategoryDto.builder()
        .code("Cat test")
        .designation("Designation test")
        .idEntreprise(1)
        .build();

    CategoryDto savedCategory = service.save(expectedCategory);

    CategoryDto categoryToUpdate = savedCategory;
    categoryToUpdate.setCode("Cat update");

    savedCategory = service.save(categoryToUpdate);

    assertNotNull(categoryToUpdate);
    assertNotNull(categoryToUpdate.getId());
    assertEquals(categoryToUpdate.getCode(), savedCategory.getCode());
    assertEquals(categoryToUpdate.getDesignation(), savedCategory.getDesignation());
    assertEquals(categoryToUpdate.getIdEntreprise(), savedCategory.getIdEntreprise());
  }

  @Test
  void shouldThrowInvalidEntityException() {
    CategoryDto expectedCategory = CategoryDto.builder().build();

    InvalidEntityException expectedException = assertThrows(InvalidEntityException.class, () -> service.save(expectedCategory));

    assertEquals(ErrorCodes.CATEGORY_NOT_VALID, expectedException.getErrorCode());
    assertEquals(1, expectedException.getErrors().size());
    assertEquals("Veuillez renseigner le code de la categorie", expectedException.getErrors().get(0));
  }

  @Test
  void shouldThrowEntityNotFoundException() {
    EntityNotFoundException expectedException = assertThrows(EntityNotFoundException.class, () -> service.findById(0));

    assertEquals(ErrorCodes.CATEGORY_NOT_FOUND, expectedException.getErrorCode());
    assertEquals("Aucune category avec l'ID = 0 n' ete trouve dans la BDD", expectedException.getMessage());
  }

  @Test
  void shouldThrowEntityNotFoundException2() {
    assertThrows(EntityNotFoundException.class, () -> service.findById(0));
  }

}
