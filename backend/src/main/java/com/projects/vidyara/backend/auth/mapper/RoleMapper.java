package com.projects.vidyara.backend.auth.mapper;

import com.projects.vidyara.backend.auth.dto.RoleDto;
import com.projects.vidyara.backend.auth.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    Role toEntity(RoleDto roleDTO) ;
    RoleDto toDTO(Role role) ;
}