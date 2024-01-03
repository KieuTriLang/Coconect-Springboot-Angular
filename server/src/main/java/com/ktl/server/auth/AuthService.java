package com.ktl.server.auth;

public interface AuthService {

    AuthResponse signIn(AuthRequest authRequest);
    void signUp(AuthRequest authRequest);


}
