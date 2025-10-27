package com.azship.adm.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.azship.adm.dto.FreteCreateDTO;
import com.azship.adm.dto.FreteItemCreateDTO;
import com.azship.adm.dto.FreteResponseDTO;
import com.azship.adm.entity.FormaDeMedida;
import com.azship.adm.entity.Frete;
import com.azship.adm.entity.FreteItem;
import com.azship.adm.entity.User;
import com.azship.adm.exception.ResourceNotFoundException;
import com.azship.adm.repository.FormaDeMedidaRepository;
import com.azship.adm.repository.FreteRepository;
import com.azship.adm.security.AuthHelper;
import com.azship.adm.specification.FreteSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FreteService {

    private final FreteRepository freteRepository;
    private final FormaDeMedidaRepository medidaRepository;
    private final AuthHelper authHelper;

    @Transactional
    public FreteResponseDTO create(FreteCreateDTO dto) {
        User user = authHelper.getAuthenticatedUser();

        Frete frete = Frete.builder()
                .descricao(dto.getDescricao())
                .dataEntrega(dto.getDataEntrega())
                .observacoes(dto.getObservacoes())
                .user(user)
                .build();

        List<FreteItem> freteItens = processarItens(frete, dto.getItens(), user.getId());
        
        frete.setItens(freteItens);

        BigDecimal valorTotal = freteItens.stream()
                .map(FreteItem::getValorCalculadoItem)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        frete.setValorTotalCalculado(valorTotal);

        Frete freteSalvo = freteRepository.save(frete);
        return new FreteResponseDTO(freteSalvo);
    }

    @Transactional
    public FreteResponseDTO update(Long freteId, FreteCreateDTO dto) {
        User user = authHelper.getAuthenticatedUser();
        
        Frete frete = findFreteEntityById(freteId, user.getId());

        frete.setDescricao(dto.getDescricao());
        frete.setDataEntrega(dto.getDataEntrega());
        frete.setObservacoes(dto.getObservacoes());

        frete.getItens().clear();

        List<FreteItem> novosItens = processarItens(frete, dto.getItens(), user.getId());
        frete.getItens().addAll(novosItens);

        BigDecimal valorTotal = novosItens.stream()
                .map(FreteItem::getValorCalculadoItem)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        frete.setValorTotalCalculado(valorTotal);

        Frete freteAtualizado = freteRepository.save(frete);
        return new FreteResponseDTO(freteAtualizado);
    }

    @Transactional(readOnly = true)
    public Page<FreteResponseDTO> findAll(Pageable pageable, String searchTerm) {
        Long userId = authHelper.getAuthenticatedUserId();
        
        Specification<Frete> spec = FreteSpecification.build(userId, searchTerm);
        
        Page<Frete> fretePage = freteRepository.findAll(spec, pageable);
        
        return fretePage.map(FreteResponseDTO::new);
    }

    @Transactional(readOnly = true)
    public FreteResponseDTO findById(Long freteId) {
        Long userId = authHelper.getAuthenticatedUserId();
        Frete frete = findFreteEntityById(freteId, userId);
        return new FreteResponseDTO(frete);
    }

    @Transactional
    public void delete(Long freteId) {
        Long userId = authHelper.getAuthenticatedUserId();
        Frete frete = findFreteEntityById(freteId, userId);
        freteRepository.delete(frete);
    }

    
    private List<FreteItem> processarItens(Frete frete, List<FreteItemCreateDTO> itensDto, Long userId) {
        List<FreteItem> freteItens = new ArrayList<>();

        for (FreteItemCreateDTO itemDto : itensDto) {
            FormaDeMedida medida = medidaRepository.findByIdAndUserId(itemDto.getFormaDeMedidaId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Forma de Medida não encontrada ou não pertence a este usuário. Id: "
                                    + itemDto.getFormaDeMedidaId()));

            BigDecimal valorCalculado = itemDto.getValorInformado()
                    .multiply(medida.getValorBaseCalculo());

            FreteItem freteItem = FreteItem.builder()
                    .frete(frete)
                    .formaDeMedida(medida)
                    .valorInformado(itemDto.getValorInformado())
                    .valorCalculadoItem(valorCalculado)
                    .build();
            
            freteItens.add(freteItem);
        }
        return freteItens;
    }

    private Frete findFreteEntityById(Long freteId, Long userId) {
        return freteRepository.findByIdAndUserId(freteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Frete não encontrado ou não pertence a este usuário. Id: " + freteId));
    }
}