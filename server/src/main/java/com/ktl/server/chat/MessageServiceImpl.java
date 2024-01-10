package com.ktl.server.chat;

import java.util.List;

import com.ktl.server.exception.BadRequestException;
import com.ktl.server.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ktl.server.user.AppUser;
import com.ktl.server.user.UserRepo;

import lombok.AllArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {


    private final MessageRepo messageRepo;


    private final UserRepo userRepo;

    @Override
    public Message saveMessage(Message message) {
        return messageRepo.save(message);
    }

    @Override
    public List<Message> getMessagesByRoomCodeBeforeId(String roomCode, Long id) {

        return messageRepo.findMessagesByRoomCodeBeforeId(roomCode, id);
    }

    @Override
    public List<Message> getMessagesByUserCodeBeforeId(String username, String receiverCode, Long id) {

        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new NotFoundException("Not found user"));

        return messageRepo.findMessagesByUserCodeBeforeId(user.getUserCode(), receiverCode, id);
    }

    @Override
    public List<Message> getMessagesByRoomCodeBegin(String roomCode) {
        // TODO Auto-generated method stub
        return messageRepo.findMessagesByRoomCodeBegin(roomCode);
    }

    @Override
    public List<Message> getMessagesByUserCodeBegin(String username, String receiverCode) {

        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new NotFoundException("Not found user"));
        // TODO Auto-generated method stub
        return messageRepo.findMessagesByUserCodeBegin(user.getUserCode(), receiverCode);
    }

}
