package com.azship.adm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.azship.adm.entity.FormaDeMedida;

public interface FormaDeMedidaRepository extends JpaRepository<FormaDeMedida, Long> {
    List<FormaDeMedida> findByUserId(Long userId);
        Optional<FormaDeMedida> findByIdAndUserId(Long id, Long userId); 
}