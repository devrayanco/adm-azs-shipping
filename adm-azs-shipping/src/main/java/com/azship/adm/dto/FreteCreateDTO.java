package com.azship.adm.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FreteCreateDTO {

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @NotNull(message = "A data de entrega é obrigatória")
    @FutureOrPresent(message = "A data de entrega não pode ser no passado")
    private LocalDate dataEntrega;

    private String observacoes;

    @Valid
    @NotEmpty(message = "O frete deve ter pelo menos um item de medida")
    private List<FreteItemCreateDTO> itens;
}