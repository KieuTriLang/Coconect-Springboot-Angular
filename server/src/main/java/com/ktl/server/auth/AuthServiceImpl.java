package com.ktl.server.auth;

import com.ktl.server.exception.NotFoundException;
import com.ktl.server.jwt.JwtService;
import com.ktl.server.token.Token;
import com.ktl.server.token.TokenRepo;
import com.ktl.server.token.TokenType;
import com.ktl.server.user.AppUser;
import com.ktl.server.user.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;

import static com.ktl.server.security.AppUserRole.USER;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{


    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final TokenRepo tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    @Override
    public AuthResponse signIn(AuthRequest authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()
                )
        );
        AppUser user = userRepo.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new NotFoundException("Not found user"));
        String accessToken = jwtService.generateToken(user,true);
        String refreshToken = jwtService.generateToken(user,false);
        revokeAllUserTokens(user);
        saveUserToken(user,accessToken,refreshToken);
        return new AuthResponse(accessToken,refreshToken);
    }

    @Override
    public void signUp(AuthRequest authRequest) {

        AppUser user = AppUser.builder()
                .userCode(UUID.randomUUID().toString())
                .username(authRequest.getUsername())
                .password(passwordEncoder.encode(authRequest.getPassword()))
                .role(USER)
                .conversations(new LinkedHashSet<>()).build();
        userRepo.save(user);
    }

    private void saveUserToken(AppUser user, String accessTokenStr, String refreshTokenStr){
        Token accessToken = Token.builder()
                .content(accessTokenStr)
                .owner(user)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        Token refreshToken = Token.builder()
                .content(refreshTokenStr)
                .owner(user)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();

        List<Token> tokens = Arrays.asList(
                accessToken,
                refreshToken
        );

        tokenRepo.saveAll(tokens);
    }
    private void revokeAllUserTokens(AppUser user) {
        List<Token> validUserTokens = tokenRepo.findByOwner_UsernameAndExpiredFalseAndRevokedFalse(user.getUsername());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepo.saveAll(validUserTokens);
    }
}
