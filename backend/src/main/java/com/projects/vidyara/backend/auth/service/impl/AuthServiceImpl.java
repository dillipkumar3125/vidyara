package com.projects.vidyara.backend.auth.service.impl;

import com.projects.vidyara.backend.auth.dto.LoginRequestDto;
import com.projects.vidyara.backend.auth.dto.UserDto;
import com.projects.vidyara.backend.auth.entity.RefreshToken;
import com.projects.vidyara.backend.auth.entity.User;
import com.projects.vidyara.backend.auth.enums.Provider;
import com.projects.vidyara.backend.auth.repositoty.RefreshTokenRepository;
import com.projects.vidyara.backend.auth.security.CustomUserDetailsService;
import com.projects.vidyara.backend.auth.security.SecurityUserDetails;
import com.projects.vidyara.backend.auth.service.AuthService;
import com.projects.vidyara.backend.auth.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserService userService ;
    private final CustomUserDetailsService customUserDetailsService ;
    private final JwtService jwtService ;
    private final CookieService cookieService ;
    private final AuthenticationManager authenticationManager ;
    private final PasswordEncoder passwordEncoder ;
    private final RefreshTokenRepository refreshTokenRepository ;

    //signup user
    @Override
    public UserDto signupUser(UserDto userDto) {
        // if any logic needed during signup
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        userDto.setProvider(userDto.getProvider() != null ? userDto.getProvider() : Provider.LOCAL);

        userDto.setEnable(true);

        userDto.setRoles(userDto.getRoles() != null ? userDto.getRoles() : Set.of());

        return userService.createUser(userDto);
    }

    @Override
    public String[] loginUser(LoginRequestDto requestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestDto.getEmail(),requestDto.getPassword())) ;
        SecurityUserDetails userDetails = (SecurityUserDetails) customUserDetailsService.loadUserByUsername(requestDto.getEmail());

        if(!userDetails.isEnabled()) throw new DisabledException("User is Disabled") ;

        Instant now = Instant.now() ;
        String jti = UUID.randomUUID().toString() ;

        RefreshToken refreshTokenDb = RefreshToken.builder()
                .jti(jti)
                .user(userDetails.getUser())
                .createdAt(now)
                .expiredAt(now.plusSeconds(jwtService.refreshTtlSeconds()))
                .revoked(false)
                .build() ;

        // saving refresh token in db
        refreshTokenRepository.save(refreshTokenDb) ;

        // creating accessToken and RefreshToken ;
        String accessToken = jwtService.generateAccessToken(userDetails) ;
        String refreshToken = jwtService.generateRefreshToken(userDetails,jti) ;

        String[] tokens = new String[2] ;

        tokens[0] = accessToken ;
        tokens[1] = refreshToken ;

        return tokens ;
    }

    @Override
    public String[] refreshUser(HttpServletRequest request, HttpServletResponse response) {

//        getting refresh token
        String refreshToken = refreshTokenFromRequest(request).orElseThrow(() -> new BadCredentialsException("Missing Refresh Token")) ;

//        check offs
        if(!jwtService.isRefreshToken(refreshToken)) throw new BadCredentialsException("Invalid Token Type") ;

        String jti = jwtService.getJti(refreshToken);
        UUID userId = jwtService.getUserId(refreshToken) ;
        RefreshToken storedRefreshToken = refreshTokenRepository.findByJti(jti).orElseThrow(() -> new BadCredentialsException("Refresh token not recognized")) ;

        if(storedRefreshToken.isRevoked()) throw new BadCredentialsException("Refresh token is revoked") ;
        if(storedRefreshToken.getExpiredAt().isBefore(Instant.now())) throw new BadCredentialsException("Refresh token is expired") ;
        if(!storedRefreshToken.getUser().getId().equals(userId)) throw new BadCredentialsException("Refresh token dose not belongs to this user") ;

//        rotation of refresh token
        storedRefreshToken.setRevoked(true);
        String newJti = UUID.randomUUID().toString() ;
        storedRefreshToken.setReplacedByJti(newJti);

        User user = storedRefreshToken.getUser() ;

        var newRefreshTokenDB = RefreshToken.builder()
                .jti(newJti)
                .createdAt(Instant.now())
                .expiredAt(Instant.now().plusSeconds(jwtService.refreshTtlSeconds()))
                .user(user)
                .revoked(false)
                .build() ;

        refreshTokenRepository.save(newRefreshTokenDB) ;

        SecurityUserDetails userDetails = (SecurityUserDetails) customUserDetailsService.loadUserByUsername(user.getEmail());

        String[] tokens = new String[2] ;


        tokens[0] = jwtService.generateAccessToken(userDetails);
        tokens[1] = jwtService.generateRefreshToken(userDetails,newJti) ;

        return tokens ;
    }

    @Override
    public void logoutUser(HttpServletRequest request,HttpServletResponse response) {
        refreshTokenFromRequest(request).ifPresent(token -> {
                if(jwtService.isRefreshToken(token)) {
                    String jti = jwtService.getJti(token) ;
                    refreshTokenRepository.findByJti(jti)
                            .ifPresent(refreshToken -> {
                                refreshToken.setRevoked(true) ;
                                refreshTokenRepository.save(refreshToken) ;
                            });
                }

        });
    }


    private Optional<String> refreshTokenFromRequest(HttpServletRequest request) {
        if(request.getCookies() != null) {
            Optional<String> refreshTokenFromCookie = Arrays.stream(request.getCookies())
                    .filter(cookie -> cookieService.getCookieName().equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .filter(v -> !v.isBlank())
                    .findFirst() ;
            if(refreshTokenFromCookie.isPresent()) return refreshTokenFromCookie ;
        }
        return Optional.empty();
    }

}
