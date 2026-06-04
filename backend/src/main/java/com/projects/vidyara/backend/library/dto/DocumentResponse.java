package com.projects.vidyara.backend.library.dto;

import com.projects.vidyara.backend.library.enums.DocumentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
public class DocumentResponse {
    private UUID id;

    private String title;

    private String description;

    private String fileType;

    private Long fileSize;

    private UUID uploadedBy;

    private DocumentStatus status;

    private Instant createdAt;
}
