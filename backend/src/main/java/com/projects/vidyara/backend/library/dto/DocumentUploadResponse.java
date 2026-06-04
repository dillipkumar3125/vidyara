package com.projects.vidyara.backend.library.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class DocumentUploadResponse {
    private UUID documentId;
    private String message;
}
