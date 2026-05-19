package com.projects.vidyara.backend.auth.service;

import com.projects.vidyara.backend.auth.dto.UserDto;

import java.util.List;

public interface UserService {

    //create user
    UserDto createUser(UserDto userDto) ;

    //get user by email
    UserDto getUserByEmail(String email) ;

    //get user by id
    UserDto getUserById(String userId) ;

    // get all user
    List<UserDto> getAllUser() ;

    //update user
    UserDto updateUser(String userId, UserDto userDto) ;

    //delete user
    void deleteUser(String userId) ;

}