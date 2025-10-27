package com.azship.adm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.azship.adm.dto.FormaDeMedidaDTO;
import com.azship.adm.service.FormaDeMedidaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/medidas")
@RequiredArgsConstructor
public class FormaDeMedidaController {

    private final FormaDeMedidaService service;

    @PostMapping
    public ResponseEntity<FormaDeMedidaDTO> create(@RequestBody @Valid FormaDeMedidaDTO dto) {
        FormaDeMedidaDTO createdDto = service.create(dto);
        return new ResponseEntity<>(createdDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FormaDeMedidaDTO>> getAll() {
        List<FormaDeMedidaDTO> list = service.findAllByAuthenticatedUser();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormaDeMedidaDTO> getById(@PathVariable Long id) {
        FormaDeMedidaDTO dto = service.findById(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormaDeMedidaDTO> update(@PathVariable Long id, @RequestBody @Valid FormaDeMedidaDTO dto) {
        FormaDeMedidaDTO updatedDto = service.update(id, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}