package com.ktl.server.room;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.ktl.server.chat.MessageRepo;
import com.ktl.server.exception.BadRequestException;
import com.ktl.server.exception.NotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ktl.server.chat.Message;
import com.ktl.server.chat.Status;
import com.ktl.server.conversation.Conversation;
import com.ktl.server.conversation.ConversationRepo;
import com.ktl.server.notification.Notification;
import com.ktl.server.notification.NotificationRepo;
import com.ktl.server.user.AppUser;
import com.ktl.server.user.UserRepo;

import lombok.AllArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    
    private final RoomRepo roomRepo;
    
    private final UserRepo userRepo;
    private final MessageRepo messageRepo;
    
    private final ConversationRepo conversationRepo;
    
    private final NotificationRepo notificationRepo;
    
    private final ModelMapper modelMapper;

    
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public RoomDto createRoom(String username, RoomRequest room) {
        // TODO Auto-generated method stub
        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new NotFoundException("Not found user"));
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
        if (conversations != null && conversations.size() > 0) {
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
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(() -> new NotFoundException("Not found room"));
        return modelMapper.map(room, RoomDto.class);
    }

    @Override
    public List<MemberInfo> getRoomMembers(String roomCode) {
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(()->new NotFoundException("Not found room"));
        List<MemberInfo> result = new ArrayList<>();
        List<String> usernames = roomRepo.findUsernamesByRoomCode(roomCode);
        usernames.forEach(username -> {
            MemberInfo memberInfo = MemberInfo.builder()
                    .username(username)
                    .isMaster(room.getCreator().equals(username))
                    .build();
            result.add(memberInfo);
        });
        return result;
    }

    @Transactional
    @Override
    public void addMembers(String authName, String roomCode, List<String> usernames) {
        // TODO Auto-generated method stub
        List<String> invitedUser = new ArrayList<>();
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(() -> new NotFoundException("Not room found"));
        if (!room.getCreator().equals(authName)) {
            throw new BadRequestException("You are not master of room.");
        }else{
            invitedUser.add(room.getCreator());
        }
        String content = room.getCreator() + " invite you to join room: " + room.getRoomName();
        for (String username : usernames) {
            if(invitedUser.contains(username)){
                continue;
            }
            AppUser user = userRepo.findByUsername(username)
                    .orElse(null);
            if(user == null){
                continue;
            }
            // room.getMembers().add(user);
            Notification recordNoti = notificationRepo.findByReceiverUsernameAndRoomCode(username,roomCode).orElse(null);
            if(recordNoti != null){
                if (recordNoti.getStatus().equals(Status.INVITE) ||
                recordNoti.getStatus().equals(Status.ACCEPT)){
                    invitedUser.add(username);
                    continue;
                }
            }
            Long idNoti = notificationRepo.save(Notification.builder()
                    .content(content)
                    .roomCode(roomCode)
                    .roomName(room.getRoomName())
                    .status(Status.INVITE)
                    .time(ZonedDateTime.now(ZoneId.of("Z")).toString()).receiver(user)
                    .build()).getId();
            Message message = Message.builder()
                    .id(idNoti)
                    .identityCode(roomCode)
                    .senderName(room.getRoomName())
                    .content(content)
                    .status(Status.INVITE)
                    .build();
            simpMessagingTemplate.convertAndSendToUser(user.getUserCode(), "/private", message);
        }

    }

    @Override
    public boolean promoteMember(String authName, String roomCode, String memberName) {
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(()-> new NotFoundException("Not found room"));
        if(room.getCreator().equals(authName)){
            if(room.getMembers().stream().anyMatch(u -> u.getUsername().equals(memberName))){
                room.setCreator(memberName);

                LocalDateTime now = LocalDateTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;                // Format the current date and time to ISO string
                String isoDateString = now.format(formatter);

                Message message = Message.builder()
                        .identityCode(roomCode)
                        .receiverCode(roomCode)
                        .senderName(room.getRoomName())
                        .content(memberName + " has been promoted to master of room.")
                        .status(Status.PROMOTE)
                        .toRoom(true)
                        .postedTime(isoDateString)
                        .build();
                messageRepo.save(message);
                simpMessagingTemplate.convertAndSend("/room/" + message.getReceiverCode(), message);
                return true;
            }
        }
        return false;
    }

    @Override
    public void removeMembers(String authName, String roomCode, List<String> usernames) {
        // TODO Auto-generated method stub
        List<String> removedUser = new ArrayList<>();
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(() -> new NotFoundException("Not room found"));
        if (!room.getCreator().equals(authName)) {
            throw new BadRequestException("You are not master of room.");
        }else {
            removedUser.add(room.getCreator());
        }
        String content = room.getRoomName() + ": You have been kicked!";
        for (String username : usernames) {
            if(removedUser.contains(username)){
                continue;
            }
            AppUser user = userRepo.findByUsername(username)
                    .orElse(null);
            if(user == null){
                continue;
            }
            user.getConversations().removeIf(c -> c.getConversationCode().equals(roomCode));
            room.getMembers().removeIf(u -> usernames.indexOf(u.getUsername()) >= 0);
            Long idNoti = notificationRepo.save(Notification.builder()
                    .content(content)
                    .roomCode(roomCode)
                    .roomName(room.getRoomName())
                    .status(Status.KICK)
                    .time(ZonedDateTime.now(ZoneId.of("Z")).toString()).receiver(user)
                    .build()).getId();
            userRepo.save(user);
            Message message = Message.builder()
                    .id(idNoti)
                    .identityCode(roomCode)
                    .content(content)
                    .status(Status.KICK)
                    .build();
            simpMessagingTemplate.convertAndSendToUser(user.getUserCode(), "/private", message);
            removedUser.add(username);
        }
        roomRepo.save(room);

    }

    @Override
    public boolean leaveRoom(String roomCode, String username) {
        // TODO Auto-generated method stub
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(() -> new NotFoundException("Not room found"));
        AppUser user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Not found user: " + username));
        if(room.getCreator().equals(username)){
            Message message = Message.builder()
                    .identityCode(roomCode)
                    .content("You need promote member to room master.")
                    .status(Status.NOTI)
                    .build();
            simpMessagingTemplate.convertAndSendToUser(user.getUserCode(), "/private", message);
            return false;
        }
        user.getConversations().removeIf(c -> c.getConversationCode().equals(roomCode));
        room.getMembers().removeIf(u -> u.equals(user));

        userRepo.save(user);
        roomRepo.save(room);
        return true;
    }

}
