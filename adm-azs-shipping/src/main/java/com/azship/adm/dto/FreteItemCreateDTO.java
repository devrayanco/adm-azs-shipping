package com.azship.adm.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FreteItemCreateDTO {
    
    @NotNull(message = "O ID da Forma de Medida é obrigatório")
    private Long formaDeMedidaId;

    @NotNull(message = "O valor informado é obrigatório")
    @DecimalMin(value = "0.0", message = "O valor informado não pode ser negativo")
    private BigDecimal valorInformado;
}