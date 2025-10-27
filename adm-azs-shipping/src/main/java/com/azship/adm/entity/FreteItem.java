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
@Table(name = "TB_FRETE_ITEM")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "frete_id", nullable = false)
    private Frete frete;

    @ManyToOne
    @JoinColumn(name = "forma_medida_id", nullable = false)
    private FormaDeMedida formaDeMedida;
    
    @Column(nullable = false)
    private BigDecimal valorInformado;

    @Column(nullable = false)
    private BigDecimal valorCalculadoItem;
}
