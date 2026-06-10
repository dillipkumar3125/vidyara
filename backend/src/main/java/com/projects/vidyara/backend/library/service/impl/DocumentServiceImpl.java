package com.projects.vidyara.backend.library.service.impl;

import com.projects.vidyara.backend.library.dto.DocumentRequest;
import com.projects.vidyara.backend.library.dto.DocumentResponse;
import com.projects.vidyara.backend.library.dto.DocumentUploadResponse;
import com.projects.vidyara.backend.library.entity.Document;
import com.projects.vidyara.backend.library.mapper.DocumentMapper;
import com.projects.vidyara.backend.library.repository.DocumentRepository;
import com.projects.vidyara.backend.library.service.DocumentService;
import com.projects.vidyara.backend.library.service.StorageService;
import com.projects.vidyara.backend.shared.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository ;
    private final DocumentMapper mapper ;
    private final StorageService storageService;


    @Override
    @Transactional
    public DocumentUploadResponse uploadDocument(MultipartFile file, DocumentRequest request, UUID userId) {
//        if(file.isEmpty()) throw new IllegalArgumentException("File is empty") ;
//
//        Document document = mapper.toEntity(request) ;
//        String objectKey = UUID.randomUUID().toString() ;
//        String originalName =
//                Objects.requireNonNullElse(file.getOriginalFilename(), "unknown-file");
//        String fileNameSaved = objectKey + "_" + originalName ;
//        Path path =
//                Paths.get(fileUrl, fileNameSaved);
//        Path uploadPath = Paths.get(fileUrl);
//
//        document.setUserId(userId);
//        document.setFileSize(file.getSize());
//        document.setFileType(file.getContentType());
//        document.setObjectKey(fileNameSaved);
//        document.setOriginalName(file.getOriginalFilename());
//
//
//        try {
//            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
//            Files.copy(file.getInputStream(),path, StandardCopyOption.REPLACE_EXISTING) ;
//
//        }catch (IOException e) {
//            throw new StorageException("Failed to upload file", e);
//        }
//
//        try {
//            documentRepository.save(document);
//        } catch (Exception e) {
//            try {
//                Files.deleteIfExists(path);
//            } catch (IOException ignored) {
//            }
//            throw e;
//        }
//
//
//        return DocumentUploadResponse.builder()
//                .documentId(document.getId())
//                .message("Document named : " + document.getOriginalName() + " is successfully uploaded")
//                .build();

        Document document = mapper.toEntity(request) ;

        String objectKey = storageService.upload(file,userId) ;

        document.setUserId(userId);
        document.setFileSize(file.getSize());
        document.setFileType(file.getContentType());
        document.setObjectKey(objectKey);
        document.setOriginalName(file.getOriginalFilename());

        try { // necessary for db rollback
            documentRepository.save(document);
        } catch (Exception e) {
            storageService.delete(objectKey);
            throw e;
        }

        return DocumentUploadResponse.builder()
                .documentId(document.getId())
                .message("Document named : " + document.getOriginalName() + " is successfully uploaded")
                .build() ;
    }

    @Override
    public DocumentResponse getDocument(UUID documentId) {
        Document document =documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("There is No such Document")) ;
        return mapper.toResponse(document) ;
    }

    @Override
    public String downloadDocument(UUID documentId) {
        Document document =documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("There is No such Document")) ;
        return storageService.generateDownloadUrl(document.getObjectKey());
    }

    @Override
    public List<DocumentResponse> getAllDocuments() {
        List<Document> documentList = documentRepository.findAll() ;
        return documentList.stream()
                .map(mapper::toResponse)
                .toList() ;
    }

    @Override
    public void deleteDocument(UUID id) {
    }
}
