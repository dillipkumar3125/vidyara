package com.projects.vidyara.backend.auth.security;

import com.projects.vidyara.backend.auth.entity.User;
import lombok.Getter;
import lombok.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

@Getter
public class SecurityUserDetails implements UserDetails {

    private final User user ;

    public SecurityUserDetails(User user) {
        this.user = user;
    }

    @Override
    public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {

        return user.getRoles()
                .stream()
                .map(role ->
                        new SimpleGrantedAuthority("ROLE_"+role.getName())) // ROLE_ prefix for separating roles and authorities
                .toList() ;

    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public @NonNull String getUsername() {
        return user.getEmail();
    }


    @Override
    public boolean isEnabled() {
        return user.getEnable();
    }
}
