package com.azship.adm.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.azship.adm.dto.FormaDeMedidaDTO;
import com.azship.adm.entity.FormaDeMedida;
import com.azship.adm.entity.User;
import com.azship.adm.exception.ResourceNotFoundException;
import com.azship.adm.repository.FormaDeMedidaRepository;
import com.azship.adm.security.AuthHelper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FormaDeMedidaService {

    private final FormaDeMedidaRepository repository;
    private final AuthHelper authHelper;

    @Transactional
    public FormaDeMedidaDTO create(FormaDeMedidaDTO dto) {
        User user = authHelper.getAuthenticatedUser();
        
        FormaDeMedida entity = dto.toEntity();
        entity.setUser(user);
        
        entity = repository.save(entity);
        return new FormaDeMedidaDTO(entity);
    }

    @Transactional(readOnly = true)
    public List<FormaDeMedidaDTO> findAllByAuthenticatedUser() {
        Long userId = authHelper.getAuthenticatedUserId();
        return repository.findByUserId(userId).stream()
                .map(FormaDeMedidaDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FormaDeMedidaDTO findById(Long id) {
        Long userId = authHelper.getAuthenticatedUserId();
        FormaDeMedida entity = findEntityByIdAndUser(id, userId);
        return new FormaDeMedidaDTO(entity);
    }

    @Transactional
    public FormaDeMedidaDTO update(Long id, FormaDeMedidaDTO dto) {
        Long userId = authHelper.getAuthenticatedUserId();
        FormaDeMedida entity = findEntityByIdAndUser(id, userId);
        entity.setNome(dto.getNome());
        entity.setUnidade(dto.getUnidade());
        entity.setValorBaseCalculo(dto.getValorBaseCalculo());
        
        entity = repository.save(entity);
        return new FormaDeMedidaDTO(entity);
    }

    @Transactional
    public void delete(Long id) {
        Long userId = authHelper.getAuthenticatedUserId();
        FormaDeMedida entity = findEntityByIdAndUser(id, userId);
        repository.delete(entity);
    }

    private FormaDeMedida findEntityByIdAndUser(Long id, Long userId) {
        return repository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Forma de Medida não encontrada ou não pertence a este usuário. Id: " + id));
    }
}