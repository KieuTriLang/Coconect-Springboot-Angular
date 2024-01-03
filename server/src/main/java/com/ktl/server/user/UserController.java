package com.ktl.server.user;

import com.ktl.server.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final JwtService jwtService;
    private final UserService userService;

    @GetMapping("/info/{userCode}")
    public ResponseEntity<Object> getInfoUserByUserCode(@PathVariable String userCode) {
        return ResponseEntity.ok(userService.getInfoUserByUserCode(userCode));
    }

    @GetMapping("/info")
    public ResponseEntity<Object> getInfo(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String username = jwtService.extractUsername(authHeader.replace("Bearer ",""));
        return ResponseEntity.ok(userService.getInfoUserByUsername(username));
    }

    @PostMapping("/conversations")
    public ResponseEntity<Object> addPrivateConversation(
            @RequestParam String senderCode,
            @RequestParam String receiverCode) {

        userService.addPrivateConversation(senderCode, receiverCode);

        userService.addPrivateConversation(receiverCode, senderCode);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/room/invite/{id}")
    public ResponseEntity<Object> acceptInvite(
            @PathVariable Long id) {
        userService.acceptInvite(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/room/invite/{id}")
    public ResponseEntity<Object> denyInvite(
            @PathVariable Long id) {
        userService.denyInvite(id);
        return ResponseEntity.ok().build();
    }
}
