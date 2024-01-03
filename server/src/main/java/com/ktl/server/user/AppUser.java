package com.ktl.server.user;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;


import com.ktl.server.conversation.Conversation;
import com.ktl.server.notification.Notification;
import com.ktl.server.room.Room;
import com.ktl.server.security.AppUserRole;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
public class AppUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userCode;
    @Enumerated(EnumType.STRING)
    private AppUserRole role;
    @Column(unique = true)
    private String username;
    private String password;
    @OneToMany
    private Set<Conversation> conversations;
    @OneToMany
    private Set<Notification> notifications;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(getRole().toString()));
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
