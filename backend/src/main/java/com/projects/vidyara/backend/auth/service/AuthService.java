package com.projects.vidyara.backend.auth.service;

import com.projects.vidyara.backend.auth.dto.LoginRequestDto;
import com.projects.vidyara.backend.auth.dto.LoginResponseDto;
import com.projects.vidyara.backend.auth.dto.UserDto;

public interface AuthService {
    //resister user
    UserDto signupUser(UserDto userDto) ;

    LoginResponseDto loginUser(LoginRequestDto requestDto) ;
}

