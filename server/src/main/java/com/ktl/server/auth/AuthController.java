package com.ktl.server.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-in")
    public ResponseEntity<AuthResponse> signIn(@RequestBody AuthRequest authRequest){
        return ResponseEntity.ok(authService.signIn(authRequest));
    }

    @PostMapping("/sign-up")
    public ResponseEntity<Void> signUp(@RequestBody AuthRequest authRequest){
        authService.signUp(authRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
