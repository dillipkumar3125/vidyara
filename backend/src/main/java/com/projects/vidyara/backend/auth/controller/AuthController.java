package com.projects.vidyara.backend.auth.controller;

import com.projects.vidyara.backend.auth.dto.LoginRequestDto;
import com.projects.vidyara.backend.auth.dto.LoginResponseDto;
import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.service.AuthService;
import com.projects.vidyara.backend.auth.service.impl.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService ;
    private final CookieService cookieService ;

    @PostMapping(path = "/signup")
    public ResponseEntity<UserDto> signupUser(@RequestBody UserDto userDto) {
        UserDto userDto1 = authService.signupUser(userDto) ;
        return new ResponseEntity<>(userDto1, HttpStatus.CREATED) ;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> loginUser(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response) {
        String[] tokens  = authService.loginUser(loginRequestDto) ;
        LoginResponseDto loginResponseDto = LoginResponseDto.builder()
                .accessToken(tokens[0])
                .build() ;

        cookieService.attachResponseCookie(response,tokens[1]);
        cookieService.addNoStoreHeaders(response);

        return ResponseEntity.ok(loginResponseDto) ;
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refreshUser(HttpServletRequest request, HttpServletResponse response) {
        String[] tokens = authService.refreshUser(request, response);
        LoginResponseDto loginResponseDto = LoginResponseDto.builder()
                .accessToken(tokens[0])
                .build() ;

        cookieService.attachResponseCookie(response,tokens[1]);

        return ResponseEntity.ok(loginResponseDto) ;
    }

    @PostMapping("/logout")
    public void logoutUser(HttpServletRequest request, HttpServletResponse response) {

        authService.logoutUser(request, response); ;

        SecurityContextHolder.clearContext();
        cookieService.clearResponseCookie(response);
        cookieService.addNoStoreHeaders(response);
    }

}
