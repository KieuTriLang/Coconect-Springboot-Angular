package com.ktl.server.user;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ktl.server.home.RegisterRequest;
import static com.ktl.server.security.AppUserRole.*;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private final UserRepo userRepo;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        return userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(
                String.format("Username %s not found", username)));
    }

    @Override
    public void register(RegisterRequest registerRequest) throws Exception {
        try {
            AppUser user = AppUser.builder()
                    .userCode(UUID.randomUUID().toString())
                    .username(registerRequest.getUsername())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .grantedAuthorities(USER.getGrantedAuthorities())
                    .isAccountNonExpired(true)
                    .isAccountNonLocked(true)
                    .isCredentialsNonExpired(true)
                    .isEnabled(true).build();
            userRepo.save(user);
        } catch (Exception ex) {
            throw new Exception(ex);
        }
    }

}
