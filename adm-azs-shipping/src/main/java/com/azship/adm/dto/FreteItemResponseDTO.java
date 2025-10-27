package com.azship.adm.dto;

import java.math.BigDecimal;
import com.azship.adm.entity.FreteItem;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FreteItemResponseDTO {

    private Long id;
    private String nomeMedida;
    private String unidadeMedida;
    private BigDecimal valorBaseCalculo;
    private BigDecimal valorInformado;
    private BigDecimal valorCalculadoItem;

    public FreteItemResponseDTO(FreteItem entity) {
        this.id = entity.getId();
        this.nomeMedida = entity.getFormaDeMedida().getNome();
        this.unidadeMedida = entity.getFormaDeMedida().getUnidade();
        this.valorBaseCalculo = entity.getFormaDeMedida().getValorBaseCalculo();
        this.valorInformado = entity.getValorInformado();
        this.valorCalculadoItem = entity.getValorCalculadoItem();
    }
}