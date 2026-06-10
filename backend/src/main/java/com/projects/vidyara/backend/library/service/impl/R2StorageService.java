package com.projects.vidyara.backend.library.service.impl;

import com.projects.vidyara.backend.library.config.R2Properties;
import com.projects.vidyara.backend.library.exception.StorageException;
import com.projects.vidyara.backend.library.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class R2StorageService implements StorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of(
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );

    private final S3Client s3Client;
    private final S3Presigner presigner;
    private final R2Properties properties;

    @Override
    public String upload(MultipartFile file, UUID userId) {

        validateFile(file);

        String objectKey =
                generateObjectKey(file, userId);

        try {

            PutObjectRequest request =
                    PutObjectRequest.builder()
                            .bucket(properties.getBucketName())
                            .key(objectKey)
                            .contentType(file.getContentType())
                            .build();

            s3Client.putObject(
                    request,
                    RequestBody.fromInputStream(
                            file.getInputStream(),
                            file.getSize()
                    )
            );

            return objectKey;

        } catch (IOException e) {
            throw new StorageException(
                    "Failed to upload file",
                    e
            );
        }
    }


    @Override
    public void delete(String objectKey) {

        DeleteObjectRequest request =
                DeleteObjectRequest.builder()
                        .bucket(properties.getBucketName())
                        .key(objectKey)
                        .build();

        s3Client.deleteObject(request);
    }

    @Override
    public String generateDownloadUrl(String objectKey) {

        GetObjectRequest getObjectRequest =
                GetObjectRequest.builder()
                        .bucket(properties.getBucketName())
                        .key(objectKey)
                        .build();

        GetObjectPresignRequest presignRequest =
                GetObjectPresignRequest.builder()
                        .signatureDuration(
                                Duration.ofMinutes(15)
                        )
                        .getObjectRequest(
                                getObjectRequest
                        )
                        .build();

        PresignedGetObjectRequest
                presignedRequest =
                presigner.presignGetObject(
                        presignRequest
                );

        return presignedRequest.url()
                .toString();
    }


    private String generateObjectKey(MultipartFile file, UUID userId) {

        String originalName =
                Objects.requireNonNullElse(
                        file.getOriginalFilename(),
                        "document"
                );

        String extension = "";

        int dotIndex =
                originalName.lastIndexOf('.');

        if (dotIndex > 0) {
            extension =
                    originalName.substring(dotIndex);
        }

        return "documents/"
                + userId
                + "/"
                + UUID.randomUUID()
                + extension;
    }


    private void validateFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new StorageException(
                    "File is empty"
            );
        }

        if (!ALLOWED_CONTENT_TYPES.contains(
                file.getContentType()
        )) {

            throw new StorageException(
                    "Only PDF and DOCX are supported"
            );
        }
    }
}
