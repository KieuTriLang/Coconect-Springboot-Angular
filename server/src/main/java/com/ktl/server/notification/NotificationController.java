package com.ktl.server.notification;

import com.ktl.server.jwt.JwtService;
import com.ktl.server.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/user")
    public ResponseEntity<Object> getAllByUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String username = jwtService.extractUsername(authHeader.replace("Bearer ",""));
        return ResponseEntity.ok(userService.getNotificationByUsername(username));
    }
}
