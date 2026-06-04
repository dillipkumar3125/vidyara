package com.projects.vidyara.backend.library.service.impl;

import com.projects.vidyara.backend.auth.controller.AuthController;
import com.projects.vidyara.backend.library.dto.DocumentRequest;
import com.projects.vidyara.backend.library.dto.DocumentResponse;
import com.projects.vidyara.backend.library.dto.DocumentUploadResponse;
import com.projects.vidyara.backend.library.entity.Document;
import com.projects.vidyara.backend.library.exception.StorageException;
import com.projects.vidyara.backend.library.mapper.DocumentMapper;
import com.projects.vidyara.backend.library.repository.DocumentRepository;
import com.projects.vidyara.backend.library.service.DocumentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository ;
    private final DocumentMapper mapper ;

    @Value("${app.file-store-url}") String fileUrl ;


    @Override
    @Transactional
    public DocumentUploadResponse uploadDocument(MultipartFile file, DocumentRequest request, UUID userId) {
        if(file.isEmpty()) throw new IllegalArgumentException("File is empty") ;

        Document document = mapper.toEntity(request) ;
        String objectKey = UUID.randomUUID().toString() ;
        String originalName =
                Objects.requireNonNullElse(file.getOriginalFilename(), "unknown-file");
        String fileNameSaved = objectKey + "_" + originalName ;
        Path path =
                Paths.get(fileUrl, fileNameSaved);
        Path uploadPath = Paths.get(fileUrl);

        document.setUserId(userId);
        document.setFileSize(file.getSize());
        document.setFileType(file.getContentType());
        document.setObjectKey(fileNameSaved);
        document.setOriginalName(file.getOriginalFilename());


        try {
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(),path, StandardCopyOption.REPLACE_EXISTING) ;

        }catch (IOException e) {
            throw new StorageException("Failed to upload file", e);
        }

        try {
            documentRepository.save(document);
        } catch (Exception e) {
            try {
                Files.deleteIfExists(path);
            } catch (IOException ignored) {
            }
            throw e;
        }


        return DocumentUploadResponse.builder()
                .documentId(document.getId())
                .message("Document named : " + document.getOriginalName() + " is successfully uploaded")
                .build();
    }

    @Override
    public DocumentResponse getDocument(UUID id) {
        return null;
    }

    @Override
    public List<DocumentResponse> getAllDocuments() {
        return List.of();
    }

    @Override
    public void deleteDocument(UUID id) {
    }
}
