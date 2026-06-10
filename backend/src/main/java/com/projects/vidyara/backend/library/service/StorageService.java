package com.projects.vidyara.backend.library.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface StorageService {

    String upload(MultipartFile file, UUID userId);

    void delete(String objectKey);

    String generateDownloadUrl(String objectKey);
}
