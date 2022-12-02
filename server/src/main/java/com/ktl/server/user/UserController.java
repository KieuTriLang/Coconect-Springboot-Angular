package com.ktl.server.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ktl.server.home.RegisterRequest;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private final UserService userService;

    @GetMapping("/{userCode}")
    public ResponseEntity<Object> getInfoUserByUserCode(@PathVariable String userCode) {
        return ResponseEntity.ok(userService.getInfoUserByUserCode(userCode));
    }

    @PostMapping("register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok().build();
    }
}
