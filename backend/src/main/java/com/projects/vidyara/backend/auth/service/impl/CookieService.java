package com.projects.vidyara.backend.auth.service.impl;

import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@Getter
@Setter
public class CookieService {
    private final String cookieName ;
    private final boolean secure ;
    private final boolean httpOnly ;
    private final String sameSite ;
    private final String domain ;
    private final Long refreshTtlSeconds ;

    private final Logger logger = LoggerFactory.getLogger(CookieService.class) ;


    public CookieService(
            @Value("${security.cookie.refresh-token-cookie-name}") String cookieName,
            @Value("${security.cookie.secure}") boolean secure,
            @Value("${security.cookie.http-only}") boolean httpOnly,
            @Value("${security.cookie.same-site}") String sameSite,
            @Value("${app.domain}") String domain,
            @Value("${security.jwt.refresh-ttl-seconds}") Long refreshTtlSeconds) {
        this.cookieName = cookieName;
        this.secure = secure;
        this.httpOnly = httpOnly;
        this.sameSite = sameSite;
        this.domain = domain;
        this.refreshTtlSeconds = refreshTtlSeconds;
    }

    public void attachResponseCookie(HttpServletResponse response,String refreshToken) {
        logger.info("Adding Cookie with name: {} and value: {}",cookieName,refreshToken);
        var responseCookieBuilder = ResponseCookie.from(cookieName,refreshToken)
                .secure(secure)
                .httpOnly(httpOnly)
                .sameSite(sameSite)
                .maxAge(refreshTtlSeconds)
                .path("/");

        if(!domain.isBlank()) responseCookieBuilder.domain(domain) ;
        ResponseCookie responseCookie = responseCookieBuilder.build() ;

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }


    public void clearResponseCookie(HttpServletResponse response) {
        var responseCookieBuilder = ResponseCookie.from(cookieName,"")
                .secure(secure)
                .httpOnly(httpOnly)
                .sameSite(sameSite)
                .maxAge(0)
                .path("/");

        if(!domain.isBlank()) responseCookieBuilder.domain(domain) ;
        ResponseCookie responseCookie = responseCookieBuilder.build() ;

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    public void addNoStoreHeaders(HttpServletResponse response) {
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        response.setHeader("Pragma", "no-cache");
    }
}
