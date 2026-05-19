package com.projects.vidyara.backend.auth.controller;

import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService ;

    @PostMapping(path = "/signup")
    public ResponseEntity<UserDto> signupUser(@RequestBody UserDto userDto) {
        UserDto userDto1 = authService.signupUser(userDto) ;
        return new ResponseEntity<>(userDto1, HttpStatus.CREATED) ;
    }

}
