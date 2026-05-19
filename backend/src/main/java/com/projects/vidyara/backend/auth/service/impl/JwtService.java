package com.projects.vidyara.backend.auth.service.impl;


import com.projects.vidyara.backend.auth.security.SecurityUserDetails;
import com.projects.vidyara.backend.shared.util.UuidUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Getter
@Setter
public class JwtService {

    private final SecretKey key ;
    private final long accessTtlSeconds ;
    private final long refreshTtlSeconds ;
    private final String issuer ;

    public JwtService(
            @Value("${security.jwt.secret}") String secret ,
            @Value("${security.jwt.access-ttl-seconds}") long accessTtlSeconds ,
            @Value("${security.jwt.refresh-ttl-seconds}") long refreshTtlSeconds ,
            @Value("${security.jwt.issuer}") String issuer ) {

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)) ;
        this.accessTtlSeconds = accessTtlSeconds ;
        this.refreshTtlSeconds = refreshTtlSeconds ;
        this.issuer = issuer ;
    }

    public String generateAccessToken(SecurityUserDetails userDetails) {
        List<String> roles = userDetails
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority) //authority -> authority.getAuthority()
                .toList();

        Instant now = Instant.now() ;

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(userDetails.getUsername())
                .claim("userId" , userDetails.getUser().getId())
                .claim("roles" , roles)
                .claim("typ" , "access")
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTtlSeconds)))
                .signWith(key)
                .compact() ;
    }

    public String generateRefreshToken(SecurityUserDetails userDetails, String jti) {
        Instant now = Instant.now() ;
        return Jwts.builder()
                .id(jti)
                .subject(userDetails.getUsername())
                .claim("typ" , "refresh")
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshTtlSeconds)))
                .signWith(key)
                .compact() ;
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token) ;
    }

    public String getEmail(String token) {
        Claims claims = parse(token).getPayload() ;
        return claims.getSubject() ;
    }


    public boolean isAccessToken(String token) {
        Claims claims = parse(token).getPayload() ;
        return "access".equals(claims.get("typ")) ;
    }

    public boolean isRefreshToken(String token) {
        Claims claims = parse(token).getPayload() ;
        return "refresh".equals(claims.get("typ")) ;
    }

    public UUID getUserId(String token) {
        Claims claims = parse(token).getPayload() ;
        return UuidUtil.parseUUID(claims.get("userId").toString());
    }

}
