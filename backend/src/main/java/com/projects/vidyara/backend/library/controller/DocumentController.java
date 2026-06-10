package com.projects.vidyara.backend.library.controller;

import com.projects.vidyara.backend.auth.controller.AuthController;
import com.projects.vidyara.backend.library.dto.DocumentRequest;
import com.projects.vidyara.backend.library.dto.DocumentResponse;
import com.projects.vidyara.backend.library.dto.DocumentUploadResponse;
import com.projects.vidyara.backend.library.dto.DownloadUrlResponse;
import com.projects.vidyara.backend.library.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/library/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final AuthController authController ;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentUploadResponse> uploadDocument(
            @RequestPart("file") MultipartFile file,
            @RequestPart("document")
            DocumentRequest request
    ) {
        UUID userId = Objects.requireNonNull(authController.getCurrentUser().getBody()).getUser().getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.uploadDocument(file, request,userId));
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<DocumentResponse> getDocument(@PathVariable UUID documentId) {
        DocumentResponse response = documentService.getDocument(documentId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<DownloadUrlResponse> downloadDocument(@PathVariable UUID documentId) {
        String url = documentService.downloadDocument(documentId);
        return ResponseEntity.ok(
                DownloadUrlResponse.builder()
                        .downloadUrl(url)
                        .build()
        ) ;
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAllDocuments() {
        List<DocumentResponse> responseList = documentService.getAllDocuments() ;

        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID documentId) {

        documentService.deleteDocument(documentId);

        return ResponseEntity.noContent().build();
    }
}