package com.projects.vidyara.backend.auth.security;

import com.projects.vidyara.backend.auth.repositoty.UserRepository;
import com.projects.vidyara.backend.auth.service.impl.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.UUID;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService ;
    private final JwtService jwtService ;

    @Autowired
    private HandlerExceptionResolver handlerExceptionResolver ;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            final String header = request.getHeader("Authorization") ;

            if(header != null && header.startsWith("Bearer ")) {

                String token = header.split(" ")[1] ;

                Claims claims = jwtService.parse(token).getPayload() ;
                SecurityUserDetails userDetails = (SecurityUserDetails) userDetailsService.loadUserByUsername(claims.getSubject());

                if("access".equals(claims.get("typ"))) {

                    if(userDetails.isEnabled() && SecurityContextHolder.getContext().getAuthentication() == null) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()) ;

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }

                }

            }
        } catch (JwtException e) {
            handlerExceptionResolver.resolveException(request,response,null,e) ;
        }

        filterChain.doFilter(request,response);

    }
}
