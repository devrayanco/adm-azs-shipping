package com.azship.adm.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TB_FORMA_MEDIDA")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormaDeMedida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String unidade; 

    @Column(nullable = false)
    private BigDecimal valorBaseCalculo; 

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}