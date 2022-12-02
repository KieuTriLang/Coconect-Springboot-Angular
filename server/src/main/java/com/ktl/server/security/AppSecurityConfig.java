package com.ktl.server.security;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import com.ktl.server.jwt.JwtAuthenticationFilter;
import com.ktl.server.jwt.JwtAuthorizationVerifier;
import com.ktl.server.jwt.JwtConfig;

import lombok.AllArgsConstructor;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class AppSecurityConfig {

    @Autowired
    private final JwtConfig jwtConfig;

    @Autowired
    private final AuthenticationConfiguration authenticationConfiguration;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception {
        return authConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(
                authenticationManager(authenticationConfiguration), jwtConfig);
        jwtAuthenticationFilter.setFilterProcessesUrl("/api/v1/users/login");
        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilter(jwtAuthenticationFilter)
                .addFilterAfter(new JwtAuthorizationVerifier(jwtConfig), JwtAuthenticationFilter.class)
                .authorizeHttpRequests()
                .antMatchers("/api/v1/users/login", "/api/v1/users/token/refresh", "/api/v1/users/register", "/")
                .permitAll()
                .anyRequest()
                .authenticated();

        return http.build();
    }

}
