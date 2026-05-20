package com.projects.vidyara.backend.auth.service.impl;

import com.projects.vidyara.backend.auth.dto.LoginRequestDto;
import com.projects.vidyara.backend.auth.dto.LoginResponseDto;
import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.enums.Provider;
import com.projects.vidyara.backend.auth.security.CustomUserDetailsService;
import com.projects.vidyara.backend.auth.security.SecurityUserDetails;
import com.projects.vidyara.backend.auth.service.AuthService;
import com.projects.vidyara.backend.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserService userService ;
    private final CustomUserDetailsService customUserDetailsService ;
    private final JwtService jwtService ;
    private final AuthenticationManager authenticationManager ;
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

    @Override
    public LoginResponseDto loginUser(LoginRequestDto requestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestDto.getEmail(),requestDto.getPassword())) ;
        SecurityUserDetails userDetails = (SecurityUserDetails) customUserDetailsService.loadUserByUsername(requestDto.getEmail());

        if(!userDetails.isEnabled()) throw new DisabledException("User is Disabled") ;

        String accessToken = jwtService.generateAccessToken(userDetails) ;

        return LoginResponseDto.builder()
                .accessToken(accessToken)
                .build() ;
    }

}
