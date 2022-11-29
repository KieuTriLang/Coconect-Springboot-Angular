package com.ktl.server.home;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomeController {

    @GetMapping("")
    public ResponseEntity<Object> indexPage() {
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("https://kieutrilang.github.io/Coconect-Springboot-Angular"))
                .build();
    }
}
