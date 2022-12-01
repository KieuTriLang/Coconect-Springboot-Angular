package com.ktl.server.home;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ktl.server.user.UserService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/")
public class HomeController {

    @Autowired
    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<Object> indexPage() {

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("https://kieutrilang.github.io/Coconect-Springboot-Angular"))
                .build();
    }

    @PostMapping("register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) throws Exception {
        userService.register(request);
        return ResponseEntity.ok().build();
    }
}
