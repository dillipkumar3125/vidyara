package com.projects.vidyara.backend.auth.dto;

import com.projects.vidyara.backend.auth.enums.Provider;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private UUID id ;

    private String email ;

    private String name ;

    private String password ;

    private String image ;

    private Boolean enable ;

    private Provider provider ;

    private Set<RoleDto> roles = new HashSet<>();

    private Instant createdAt ;
    private Instant updatedAt ;
}

