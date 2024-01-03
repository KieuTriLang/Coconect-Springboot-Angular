package com.ktl.server.home;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;


//@RestController
//@RequestMapping("")
public class HomeController {

//    @GetMapping("")
    public ResponseEntity<Object> indexPage() {

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("https://kieutrilang.github.io/Coconect-Springboot-Angular"))
                .build();
    }

}
