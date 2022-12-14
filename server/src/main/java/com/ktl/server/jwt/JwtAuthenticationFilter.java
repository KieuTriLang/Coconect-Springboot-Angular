package com.ktl.server.jwt;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

        @Autowired
        private final AuthenticationManager authenticationManager;
        @Autowired
        private final JwtConfig jwtConfig;

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
                Algorithm algorithm = Algorithm.HMAC256(jwtConfig.getSecretKey().getBytes());
                String access_token = JWT.create()
                                .withSubject(authResult.getName())
                                .withExpiresAt(java.sql.Date.valueOf(LocalDate.now().plusDays(jwtConfig
                                                .getTokenExperationAfterDays())))
                                .withIssuer(request.getRequestURL().toString())
                                .withClaim("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                                                .collect(Collectors
                                                                .toList()))
                                .sign(algorithm);
                // String refresh_token = JWT.create()
                // .withSubject(authResult.getName())
                // .withExpiresAt(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 *
                // 1000))
                // .withIssuer(request.getRequestURL().toString())
                // .sign(algorithm);
                Map<String, String> tokens = new HashMap<>();
                tokens.put("access_token", access_token);
                // tokens.put("refresh_token", refresh_token);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), tokens);
        }

}
