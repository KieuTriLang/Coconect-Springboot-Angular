package com.ktl.server.chat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.ktl.server.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpHeaders;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;
    private final JwtService jwtService;

    @GetMapping("/room/{roomCode}")
    public ResponseEntity<Object> getRoomConversation(@PathVariable String roomCode,
            @RequestParam Long id) {
        List<Message> messages = new ArrayList<>();
        if (id > 0) {

            messages = messageService.getMessagesByRoomCodeBeforeId(roomCode, id);
        } else {
            messages = messageService.getMessagesByRoomCodeBegin(roomCode);
        }
        // Collections.reverse(messages);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/private/{receiverCode}")
    public ResponseEntity<Object> getPrivateConversation(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable String receiverCode,
            @RequestParam Long id) {
        String username = jwtService.extractUsername(authHeader.replace("Bearer ",""));
        List<Message> messages;
        if (id > 0) {
            log.info("with id");
            messages = messageService.getMessagesByUserCodeBeforeId(username, receiverCode, id);
        } else {
            log.info("no id");
            messages = messageService.getMessagesByUserCodeBegin(username, receiverCode);
        }
        // Collections.reverse(messages);
        return ResponseEntity.ok(messages);
    }
}
