package com.projects.vidyara.backend.library.service;

import com.projects.vidyara.backend.library.dto.DocumentRequest;
import com.projects.vidyara.backend.library.dto.DocumentResponse;
import com.projects.vidyara.backend.library.dto.DocumentUploadResponse;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface DocumentService {

    DocumentUploadResponse uploadDocument(MultipartFile file, DocumentRequest request, UUID userId);

    DocumentResponse getDocument(UUID id);

    String downloadDocument(UUID documentId) ;

    List<DocumentResponse> getAllDocuments();

    void deleteDocument(UUID id);
}
