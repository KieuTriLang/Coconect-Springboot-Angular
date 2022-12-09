package com.ktl.server.chat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.net.HttpHeaders;
import com.ktl.server.helper.AuthorizationHeaderHelper;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/messages")
@AllArgsConstructor
public class MessageController {
    @Autowired
    private final MessageService messageService;

    @Autowired
    private final AuthorizationHeaderHelper authorizationHeaderHelper;

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
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader, @PathVariable String receiverCode,
            @RequestParam Long id) {
        String username = authorizationHeaderHelper.getSub(authorizationHeader);
        List<Message> messages = new ArrayList<>();
        if (id > 0) {

            messages = messageService.getMessagesByUserCodeBeforeId(username, receiverCode, id);
        } else {
            messages = messageService.getMessagesByUserCodeBegin(username, receiverCode);
        }
        // Collections.reverse(messages);
        return ResponseEntity.ok(messages);
    }
}
