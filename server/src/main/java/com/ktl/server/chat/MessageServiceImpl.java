package com.ktl.server.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ktl.server.user.AppUser;
import com.ktl.server.user.UserRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MessageServiceImpl implements MessageService {

    @Autowired
    private final MessageRepo messageRepo;

    @Autowired
    private final UserRepo userRepo;

    @Override
    public Message saveMessage(Message message) {
        try {
            return messageRepo.save(message);
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage());
        }

    }

    @Override
    public List<Message> getMessagesByRoomCodeBeforeId(String roomCode, Long id) {

        return messageRepo.findMessagesByRoomCodeBeforeId(roomCode, id);
    }

    @Override
    public List<Message> getMessagesByUserCodeBeforeId(String username, String receiverCode, Long id) {

        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("Not found user"));

        return messageRepo.findMessagesByUserCodeBeforeId(user.getUserCode(), receiverCode, id);
    }

    @Override
    public List<Message> getMessagesByRoomCodeBegin(String roomCode) {
        // TODO Auto-generated method stub
        return messageRepo.findMessagesByRoomCodeBegin(roomCode);
    }

    @Override
    public List<Message> getMessagesByUserCodeBegin(String username, String receiverCode) {
        // TODO Auto-generated method stub
        return messageRepo.findMessagesByUserCodeBegin(receiverCode, receiverCode);
    }

}
