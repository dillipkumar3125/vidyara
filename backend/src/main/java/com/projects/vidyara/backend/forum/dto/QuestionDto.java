package com.projects.vidyara.backend.forum.dto;

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
public class QuestionDto {
    private UUID id ;

    private String heading ;

    private String content ;

    private Set<String> tags = new HashSet<>() ;

    private Instant createdAt ;
    private Instant updatedAt ;
}
