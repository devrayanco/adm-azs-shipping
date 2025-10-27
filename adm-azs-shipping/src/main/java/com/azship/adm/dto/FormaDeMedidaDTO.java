package com.azship.adm.dto;

import java.math.BigDecimal;

import com.azship.adm.entity.FormaDeMedida;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FormaDeMedidaDTO {
    
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "A unidade é obrigatória")
    private String unidade;

    @NotNull(message = "O valor base é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "O valor base deve ser maior que zero")
    private BigDecimal valorBaseCalculo;

    public FormaDeMedidaDTO(FormaDeMedida entity) {
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.unidade = entity.getUnidade();
        this.valorBaseCalculo = entity.getValorBaseCalculo();
    }

    public FormaDeMedida toEntity() {
        return FormaDeMedida.builder()
                .id(this.id)
                .nome(this.nome)
                .unidade(this.unidade)
                .valorBaseCalculo(this.valorBaseCalculo)
                .build();
    }
}