package com.ktl.server.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.net.HttpHeaders;
import com.ktl.server.helper.AuthorizationHeaderHelper;
import com.ktl.server.user.UserService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @Autowired
    private final UserService userService;

    @Autowired
    private final AuthorizationHeaderHelper authorizationHeaderHelper;

    @GetMapping("/user")
    public ResponseEntity<Object> getAllByUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String username = authorizationHeaderHelper.getSub(authorizationHeader);
        return ResponseEntity.ok(userService.getNotificationByUsername(username));
    }
}
