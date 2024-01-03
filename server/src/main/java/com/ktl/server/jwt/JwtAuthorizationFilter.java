package com.ktl.server.jwt;

import java.io.IOException;
import java.util.*;

import static java.util.Arrays.stream;

import com.ktl.server.token.TokenRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenRepo tokenRepo;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

//        if (request.getServletPath().equals("/api/v1/auth/sign-up")
//                || request.getServletPath().equals("/api/v1/auth/token/refresh")) {
//            filterChain.doFilter(request, response);
//        } else {
//            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//            if (authHeader != null && authHeader.startsWith("Bearer ")) {
//                try {
//                    String token = authHeader.replace("Bearer ", "");
//                    String username = jwtService.extractUsername(token);
//                    if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
//                        User user = (User) userDetailsService.loadUserByUsername(username);
//                        Boolean isTokenValid = tokenRepo.findByContent(token)
//                                .map(t -> !t.getExpired() && !t.getRevoked())
//                                .orElse(false);
//                        if(jwtService.isTokenValid(token, user) && isTokenValid){
//                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                                    user,
//                                    null,
//                                    user.getAuthorities()
//                            );
//                            authToken.setDetails(
//                                    new WebAuthenticationDetailsSource().buildDetails(request)
//                            );
//                            SecurityContextHolder.getContext().setAuthentication(authToken);
//                        }
//                        filterChain.doFilter(request,response);
//                    }
//                } catch (Exception e) {
//                    // TODO: handle exception
//                    response.setHeader("error", e.getMessage());
//                    response.setStatus(HttpStatus.FORBIDDEN.value());
//                    Map<String, String> error = new HashMap<>();
//                    error.put("message", e.getMessage());
//                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
//                    new ObjectMapper().writeValue(response.getOutputStream(), error);
//                }
//            } else {
//                filterChain.doFilter(request, response);
//            }
//        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        final String username;

        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }
        jwt = authHeader.replace("Bearer ","");
        username = jwtService.extractUsername(jwt);
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            User user = (User) userDetailsService.loadUserByUsername(username);
            Boolean isTokenValid = tokenRepo.findByContent(jwt)
                    .map(t -> !t.getExpired() && !t.getRevoked())
                    .orElse(false);
            if(jwtService.isTokenValid(jwt, user) && isTokenValid){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            filterChain.doFilter(request,response);
        }
    }

}
