package com.ktl.server.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.net.HttpHeaders;
import com.ktl.server.helper.AuthorizationHeaderHelper;
import com.ktl.server.home.RegisterRequest;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private final UserService userService;

    @Autowired
    private final AuthorizationHeaderHelper authorizationHeaderHelper;

    @GetMapping("/info/{userCode}")
    public ResponseEntity<Object> getInfoUserByUserCode(@PathVariable String userCode) {
        return ResponseEntity.ok(userService.getInfoUserByUserCode(userCode));
    }

    @GetMapping("/info")
    public ResponseEntity<Object> getInfo(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String username = authorizationHeaderHelper.getSub(authorizationHeader);
        return ResponseEntity.ok(userService.getInfoUserByUsername(username));
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok().build();
    }
}
