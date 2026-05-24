package com.projects.vidyara.backend.auth.dto;

import lombok.*;

import java.time.Instant;
import java.util.Date;

@Data
@Builder
public class LoginResponseDto {
    private String accessToken ;
}
