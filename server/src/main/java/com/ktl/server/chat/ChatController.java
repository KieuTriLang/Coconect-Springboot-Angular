package com.ktl.server.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ktl.server.user.UserService;

import lombok.AllArgsConstructor;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
@RequiredArgsConstructor
public class ChatController {


    private final MessageService messageService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receivePublicMessage(@Payload Message message) {
        return message;
    }

    @MessageMapping("/message-private")
    public Message receivePrivateMessage(@Payload Message message) {
        if (message.getStatus().equals(Status.TYPING)) {
            simpMessagingTemplate.convertAndSendToUser(message.getReceiverCode(), "/private", message);
            return message;
        }
        Message mess = messageService.saveMessage(message);
        simpMessagingTemplate.convertAndSendToUser(mess.getReceiverCode(), "/private", mess);
        return mess;
    }

    @MessageMapping("/message-room")
    public Message receiveGroupMessage(@Payload Message message) {
        message.setToRoom(true);
        if (message.getStatus().equals(Status.TYPING)) {
            simpMessagingTemplate.convertAndSend("/room/" + message.getReceiverCode(), message);
            return message;
        }

        Message mess = messageService.saveMessage(message);
        simpMessagingTemplate.convertAndSend("/room/" + mess.getReceiverCode(), mess);
        return mess;
    }

}
