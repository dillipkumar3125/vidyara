package com.projects.vidyara.backend.forum.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDto {
    private UUID id ;

    private String content ;

    private Instant createdAt ;
    private Instant updatedAt ;
}
