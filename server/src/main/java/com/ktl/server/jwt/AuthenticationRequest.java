package com.ktl.server.jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class AuthenticationRequest {
    private String username;
    private String password;
}
