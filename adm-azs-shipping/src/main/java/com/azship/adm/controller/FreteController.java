package com.azship.adm.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.azship.adm.dto.FreteCreateDTO;
import com.azship.adm.dto.FreteResponseDTO;
import com.azship.adm.service.FreteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/fretes")
@RequiredArgsConstructor
public class FreteController {

    private final FreteService service;

    @PostMapping
    public ResponseEntity<FreteResponseDTO> create(@RequestBody @Valid FreteCreateDTO dto) {
        FreteResponseDTO createdDto = service.create(dto);
        return new ResponseEntity<>(createdDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FreteResponseDTO> update(@PathVariable Long id, @RequestBody @Valid FreteCreateDTO dto) {
        FreteResponseDTO updatedDto = service.update(id, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FreteResponseDTO> getById(@PathVariable Long id) {
        FreteResponseDTO dto = service.findById(id);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<FreteResponseDTO>> list(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "dir", defaultValue = "asc") String dir,
            @RequestParam(value = "q", required = false) String searchTerm
    ) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        
        Page<FreteResponseDTO> fretePage = service.findAll(pageable, searchTerm);
        
        return ResponseEntity.ok(fretePage);
    }
}