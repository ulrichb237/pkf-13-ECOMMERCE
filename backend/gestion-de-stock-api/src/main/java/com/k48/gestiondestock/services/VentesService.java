package com.k48.gestiondestock.services;

import com.k48.gestiondestock.dto.VentesDto;
import java.util.List;

public interface VentesService {

  VentesDto save(VentesDto dto);

  VentesDto findById(Integer id);

  VentesDto findByCode(String code);

  List<VentesDto> findAll();

  void delete(Integer id);

}
