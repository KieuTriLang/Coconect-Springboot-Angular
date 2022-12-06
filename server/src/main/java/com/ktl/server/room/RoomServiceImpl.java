package com.ktl.server.room;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ktl.server.chat.Message;
import com.ktl.server.chat.Status;
import com.ktl.server.conversation.Conversation;
import com.ktl.server.conversation.ConversationRepo;
import com.ktl.server.user.AppUser;
import com.ktl.server.user.UserRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService {

    @Autowired
    private final RoomRepo roomRepo;
    @Autowired
    private final UserRepo userRepo;
    @Autowired
    private final ConversationRepo conversationRepo;
    @Autowired
    private final ModelMapper modelMapper;

    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public RoomDto createRoom(String username, RoomRequest room) {
        // TODO Auto-generated method stub
        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("Not found user"));
        Room r = Room.builder()
                .roomCode(UUID.randomUUID().toString())
                .roomName(room.getRoomName())
                .members(new LinkedHashSet<>(Arrays.asList(user)))
                .creator(username)
                .build();
        Room nr = roomRepo.save(r);
        Conversation conversation = conversationRepo
                .save(new Conversation(null, nr.getRoomCode(), nr.getRoomName(), 0, false));
        Set<Conversation> conversations = user.getConversations();
        if (conversations.size() > 0) {
            user.getConversations().add(conversation);
        } else {
            user.setConversations(new LinkedHashSet<>(Arrays.asList(conversation)));
        }
        userRepo.save(user);
        nr.getMembers();
        return modelMapper.map(nr, RoomDto.class);
    }

    @Override
    public RoomDto getRoomByRoomCode(String roomCode) {
        // TODO Auto-generated method stub
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(() -> new RuntimeException("Not found room"));
        return modelMapper.map(room, RoomDto.class);
    }

    @Transactional
    @Override
    public void addMembers(String roomCode, List<String> usernames) {
        // TODO Auto-generated method stub
        List<String> userCodes = new ArrayList<>();
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(() -> new RuntimeException("Not room found"));
        for (String username : usernames) {
            AppUser user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Not found user: " + username));
            room.getMembers().add(user);
            userCodes.add(user.getUserCode());
        }
        Message message = Message.builder()
                .identityCode(roomCode)
                .content("You have an invitation from " + room.getRoomName())
                .status(Status.INVITE)
                .build();
        for (String userCode : userCodes) {
            simpMessagingTemplate.convertAndSendToUser(userCode, "/private", message);
        }

    }

    @Override
    public void removeMembers(String roomCode, List<String> usernames) {
        // TODO Auto-generated method stub
        List<String> userCodes = new ArrayList<>();
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(() -> new RuntimeException("Not room found"));
        for (String username : usernames) {
            AppUser user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Not found user: " + username));
            room.getMembers().removeIf(u -> usernames.indexOf(u.getUsername()) >= 0);
            userCodes.add(user.getUserCode());
        }
        Message message = Message.builder()
                .identityCode(roomCode)
                .content(room.getRoomName() + ": You have been kicked!")
                .status(Status.INVITE)
                .build();
        for (String userCode : userCodes) {
            simpMessagingTemplate.convertAndSendToUser(userCode, "/private", message);
        }
    }

}
