package com.ktl.server.chat;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

@Component
@Slf4j
public class WebSocketEventListener {


    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {

    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {

    }

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {

    }

    @EventListener
    public void handleSessionUnsubscribe(SessionUnsubscribeEvent event) {

    }
}
