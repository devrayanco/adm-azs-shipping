package com.azship.adm.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.azship.adm.entity.Frete;

public interface FreteRepository extends JpaRepository<Frete, Long>, JpaSpecificationExecutor<Frete> {
    
    Page<Frete> findByUserId(Long userId, Pageable pageable);
    Page<Frete> findAll(Specification<Frete> spec, Pageable pageable);
    Optional<Frete> findByIdAndUserId(Long id, Long userId);
}
