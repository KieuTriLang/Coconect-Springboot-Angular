package com.ktl.server.chat;

import java.util.List;

public interface MessageService {

    Message saveMessage(Message message);

    List<Message> getMessagesByRoomCodeBeforeId(String roomCode, Long id);

    List<Message> getMessagesByUserCodeBeforeId(String username, String receiverCode, Long id);

    List<Message> getMessagesByRoomCodeBegin(String roomCode);

    List<Message> getMessagesByUserCodeBegin(String username, String receiverCode);
}
