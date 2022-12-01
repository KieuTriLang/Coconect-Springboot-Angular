package com.ktl.server.home;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class RegisterRequest {
    private String username;
    private String password;
}
