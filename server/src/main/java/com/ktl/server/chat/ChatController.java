package com.ktl.server.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ktl.server.user.UserService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class ChatController {

    @Autowired
    private final MessageService messageService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receivePublicMessage(@Payload Message message) {
        return message;
    }

    @MessageMapping("/message-private")
    public Message receivePrivateMessage(@Payload Message message) {

        Message mess = messageService.saveMessage(message);
        simpMessagingTemplate.convertAndSendToUser(mess.getReceiverCode(), "/private", mess);
        return mess;
    }

    @MessageMapping("/message-room")
    public Message receiveGroupMessage(@Payload Message message) {
        message.setToRoom(true);
        Message mess = messageService.saveMessage(message);
        simpMessagingTemplate.convertAndSend("/room/" + mess.getReceiverCode(), mess);
        return mess;
    }
}
