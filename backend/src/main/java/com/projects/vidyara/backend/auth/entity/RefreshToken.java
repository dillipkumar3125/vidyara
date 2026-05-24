package com.projects.vidyara.backend.auth.entity;

import com.projects.vidyara.backend.auth.security.SecurityUserDetails;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID tokenId ;

    @Column(name = "jti",unique = true, nullable = false, updatable = false)
    private String jti ;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user ;

    @Column(updatable = false,nullable = false)
    private Instant createdAt ;

    @Column(nullable = false)
    private Instant expiredAt ;

    @Column(nullable = false)
    private boolean revoked ;

    private String replacedByJti ;
}
