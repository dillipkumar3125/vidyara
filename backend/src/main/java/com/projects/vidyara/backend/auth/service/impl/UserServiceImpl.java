package com.projects.vidyara.backend.auth.service.impl;

import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.entity.User;
import com.projects.vidyara.backend.auth.mapper.UserMapper;
import com.projects.vidyara.backend.auth.repositoty.UserRepository;
import com.projects.vidyara.backend.auth.service.UserService;
import com.projects.vidyara.backend.shared.exception.ResourceNotFoundException;
import com.projects.vidyara.backend.shared.util.UuidUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository ;
    private final UserMapper userMapper ;


    @Override
    public UserDto createUser(UserDto userDto) {
        if(userDto.getEmail() == null) throw new  IllegalArgumentException("User Must have a Email") ;
        if(userRepository.existsByEmail(userDto.getEmail())) throw new IllegalArgumentException("This Email is Already exist") ;

        User user = userMapper.toEntity(userDto) ;

        User savedUser = userRepository.save(user) ;
        return userMapper.toDto(savedUser) ;

    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).
                orElseThrow(() -> new ResourceNotFoundException("There is No User with email : " + email));
        return userMapper.toDto(user) ;
    }

    @Override
    public UserDto getUserById(String userId) {
        User user = userRepository.findById(UuidUtil.parseUUID(userId)).
                orElseThrow(() -> new ResourceNotFoundException("There is No User with id : " + userId));
        return userMapper.toDto(user) ;
    }

    @Override
    public List<UserDto> getAllUser() {
        List<User> userList = userRepository.findAll() ;
        return userList
                .stream()
                .map(userMapper::toDto)
                .toList() ;
    }

    @Override
    public UserDto updateUser(String userId, UserDto userDto) {
        User existingUser = userRepository.findById(UuidUtil.parseUUID(userId)).
                orElseThrow(() -> new ResourceNotFoundException("There is No User with id : " + userId));
        if(userDto.getName() != null) existingUser.setName(userDto.getName());
        if(userDto.getImage() != null) existingUser.setImage(userDto.getImage());

        // password change logic

        existingUser.setEnable(userDto.getEnable());
        existingUser.setUpdatedAt(Instant.now());

        User updatedUser = userRepository.save(existingUser) ;
        return userMapper.toDto(updatedUser) ;
    }

    @Override
    public void deleteUser(String userId) {
        User user = userRepository.findById(UuidUtil.parseUUID(userId)).
                orElseThrow(() -> new ResourceNotFoundException("There is No User with id : " + userId));
        userRepository.deleteById(user.getId());
    }
}
