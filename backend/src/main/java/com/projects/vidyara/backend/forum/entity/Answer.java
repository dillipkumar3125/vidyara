package com.projects.vidyara.backend.forum.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id ;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content ;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId ;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question ;

    private Instant createdAt ;
    private Instant updatedAt ;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now() ;
        if(createdAt == null) createdAt = now ;
        updatedAt = now ;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now() ;
    }

}
