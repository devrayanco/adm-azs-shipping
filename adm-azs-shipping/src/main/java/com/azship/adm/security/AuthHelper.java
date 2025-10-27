package com.azship.adm.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.azship.adm.entity.User;
import com.azship.adm.exception.ResourceNotFoundException;
import com.azship.adm.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthHelper {

    private final UserRepository userRepository;

    public User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado no banco de dados."));
    }

    public Long getAuthenticatedUserId() {
        return getAuthenticatedUser().getId();
    }
}