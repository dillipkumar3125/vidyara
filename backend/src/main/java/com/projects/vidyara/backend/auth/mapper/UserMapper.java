package com.projects.vidyara.backend.auth.mapper;

import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserDto userDto) ;
    UserDto toDto(User user) ;
}
