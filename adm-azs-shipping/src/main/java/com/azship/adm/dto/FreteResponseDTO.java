package com.azship.adm.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.azship.adm.entity.Frete;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FreteResponseDTO {

    private Long id;
    private String descricao;
    private LocalDate dataEntrega;
    private String observacoes;
    private BigDecimal valorTotalCalculado;
    private List<FreteItemResponseDTO> itens;

    public FreteResponseDTO(Frete entity) {
        this.id = entity.getId();
        this.descricao = entity.getDescricao();
        this.dataEntrega = entity.getDataEntrega();
        this.observacoes = entity.getObservacoes();
        this.valorTotalCalculado = entity.getValorTotalCalculado();
        this.itens = entity.getItens().stream()
                .map(FreteItemResponseDTO::new)
                .collect(Collectors.toList());
    }
}