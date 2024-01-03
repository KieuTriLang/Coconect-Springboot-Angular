package com.ktl.server.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktl.server.token.Token;
import com.ktl.server.token.TokenRepo;
import com.ktl.server.token.TokenType;
import com.ktl.server.user.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

        private final TokenRepo tokenRepo;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;


        @Override
        public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
                        throws AuthenticationException {
                AuthenticationRequest authenticationRequest = AuthenticationRequest.builder()
                                .username(request.getParameter("username")).password(request.getParameter("password"))
                                .build();

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                                authenticationRequest.getUsername(),
                                authenticationRequest.getPassword());

                return authenticationManager.authenticate(authentication);
        }

        @Override
        protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                        FilterChain chain,
                        Authentication authResult) throws IOException, ServletException {

                User user = (User) authResult.getPrincipal();
                Map<String, String> tokens = new HashMap<>();
                String accessToken = jwtService.generateToken(user, true);
                String refreshToken = jwtService.generateToken(user, false);
//                revokeAllUserTokens();
                tokens.put("access_token", accessToken);
                tokens.put("refresh_token", refreshToken);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), tokens);
        }



}
