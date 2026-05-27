package com.projects.vidyara.backend.auth.service;

import com.projects.vidyara.backend.auth.dto.LoginRequestDto;
import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.security.SecurityUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    //resister user
    UserDto signupUser(UserDto userDto) ;

    String[] loginUser(LoginRequestDto requestDto) ;

    String[] refreshUser(HttpServletRequest request, HttpServletResponse response) ;

    void logoutUser(HttpServletRequest request,HttpServletResponse response);

    SecurityUserDetails getCurrentUser() ;
}

