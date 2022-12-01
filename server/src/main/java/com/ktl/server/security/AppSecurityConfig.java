package com.ktl.server.security;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import com.ktl.server.jwt.JwtAuthenticationFilter;
import com.ktl.server.jwt.JwtConfig;
import com.ktl.server.jwt.JwtTokenVerifier;

import lombok.AllArgsConstructor;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class AppSecurityConfig {

    @Autowired
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final JwtConfig jwtConfig;
    @Autowired
    private final SecretKey secretKey;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilter(new JwtAuthenticationFilter(authenticationManager, jwtConfig, secretKey))
                .addFilterAfter(new JwtTokenVerifier(jwtConfig, secretKey), JwtAuthenticationFilter.class)
                .authorizeHttpRequests()
                .antMatchers("/").permitAll()
                .anyRequest()
                .authenticated();

        return http.build();
    }
}
