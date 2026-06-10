package com.projects.vidyara.backend.library.entity;

import com.projects.vidyara.backend.library.enums.DocumentStatus;
import jakarta.persistence.*;
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
@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;

    private String description;

    private String objectKey;

    private String originalName;

    private String fileType;

    private Long fileSize;

    private UUID userId;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    private Instant uploadedAt;
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now() ;
        if(uploadedAt == null) uploadedAt = now ;
        updatedAt = now ;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now() ;
    }
}