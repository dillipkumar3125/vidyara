package com.projects.vidyara.backend.forum.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id ;

    @Column(nullable = false)
    private String heading ;

    @ElementCollection
    @CollectionTable(name = "question_tags")
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>() ;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content ;

    @Column(name = "user_id", nullable = false,unique = true)
    private UUID userId ;

    @OneToMany(mappedBy = "question", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>() ;

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
