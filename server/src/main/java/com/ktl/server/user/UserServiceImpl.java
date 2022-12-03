package com.ktl.server.user;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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

    @Autowired
    private final ModelMapper modelMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("Not found username"));
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                authorities);
    }

    @Override
    public void register(RegisterRequest registerRequest) {
        try {
            AppUser user = AppUser.builder()
                    .userCode(UUID.randomUUID().toString())
                    .username(registerRequest.getUsername())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .role(USER)
                    .rooms(new LinkedHashSet<>()).build();
            userRepo.save(user);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public AppUserDto getInfoUserByUserCode(String userCode) {
        // TODO Auto-generated method stub
        AppUser user = userRepo.findByUserCode(userCode).orElseThrow(() -> new RuntimeException("User not found"));
        return modelMapper.map(user, AppUserDto.class);
    }

    @Override
    public AppUserDto getInfoUserByUsername(String username) {
        // TODO Auto-generated method stub
        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user.getRooms();
        return modelMapper.map(user, AppUserDto.class);
    }

}
