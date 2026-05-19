package com.projects.vidyara.backend.auth.service;

import com.projects.vidyara.backend.auth.dto.UserDto;

public interface AuthService {
    //resister user
    UserDto signupUser(UserDto userDto) ;
}

