package com.projects.vidyara.backend.auth.entity;

import com.projects.vidyara.backend.auth.enums.Provider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID id ;

    @Column(name = "user_email", nullable = false,unique = true)
    private String email ;

    @Column(name = "user_name", nullable = false)
    private String name ;

    @Column(nullable = false)
    private String password ;

    private String image ;

    private Boolean enable ;

    @Enumerated(value = EnumType.STRING)
    private Provider provider ;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

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

