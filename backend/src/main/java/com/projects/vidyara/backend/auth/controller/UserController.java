package com.projects.vidyara.backend.auth.controller;

import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/user")
public class UserController {
    private final UserService userService ;

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto) ;
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED) ;
    }

    @GetMapping(path = "/{userId}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String userId) {
        UserDto userDto = userService.getUserById(userId) ;
        return ResponseEntity.ok(userDto) ;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUser() {
        List<UserDto> userDtoList = userService.getAllUser() ;
        return ResponseEntity.ok(userDtoList) ;
    }

    @PutMapping(path = "/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable String userId, @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(userId, userDto) ;
        return ResponseEntity.ok(updatedUser) ;
    }

    @DeleteMapping(path = "/{userId}")
    public void deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
    }
}
