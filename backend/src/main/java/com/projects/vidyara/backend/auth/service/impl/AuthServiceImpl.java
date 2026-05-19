package com.projects.vidyara.backend.auth.service.impl;

import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.enums.Provider;
import com.projects.vidyara.backend.auth.service.AuthService;
import com.projects.vidyara.backend.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserService userService ;
    private final PasswordEncoder passwordEncoder ;

    //signup user
    @Override
    public UserDto signupUser(UserDto userDto) {
        // if any logic needed during signup
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        userDto.setProvider(userDto.getProvider() != null ? userDto.getProvider() : Provider.LOCAL);

        userDto.setEnable(true);

        userDto.setRoles(userDto.getRoles() != null ? userDto.getRoles() : Set.of());

        return userService.createUser(userDto);
    }

}
