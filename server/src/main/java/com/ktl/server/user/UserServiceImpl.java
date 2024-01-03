package com.ktl.server.user;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.ktl.server.exception.BadRequestException;
import com.ktl.server.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ktl.server.chat.Message;
import com.ktl.server.chat.MessageRepo;
import com.ktl.server.chat.Status;
import com.ktl.server.conversation.Conversation;
import com.ktl.server.conversation.ConversationRepo;
import com.ktl.server.conversation.ConversationResponse;
import com.ktl.server.home.RegisterRequest;
import com.ktl.server.notification.Notification;
import com.ktl.server.notification.NotificationRepo;
import com.ktl.server.room.Room;
import com.ktl.server.room.RoomRepo;

import static com.ktl.server.security.AppUserRole.*;

import lombok.AllArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    
    private final UserRepo userRepo;
    
    private final ConversationRepo conversationRepo;
    
    private final MessageRepo messageRepo;
    
    private final RoomRepo roomRepo;
    
    private final NotificationRepo notificationRepo;
    
    private final ModelMapper modelMapper;

    private final SimpMessagingTemplate simpMessagingTemplate;


    @Override
    public AppUserDto getInfoUserByUserCode(String userCode) {
        // TODO Auto-generated method stub
        AppUser user = userRepo.findByUserCode(userCode).orElseThrow(() -> new NotFoundException("User not found"));
        return modelMapper.map(user, AppUserDto.class);
    }

    @Override
    public AppUserDto getInfoUserByUsername(String username) {
        // TODO Auto-generated method stub
        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new NotFoundException("User not found"));
        user.getConversations();
        return modelMapper.map(user, AppUserDto.class);
    }

    @Override
    public void addPrivateConversation(String senderCode, String receiverCode) {
        // TODO Auto-generated method stub
        AppUser sender = userRepo.findByUserCode(senderCode)
                .orElseThrow(() -> new NotFoundException("Not found sender"));

        Set<Conversation> senderCon = sender.getConversations();

        boolean existConversation = false;

        if (senderCon != null) {
            existConversation = senderCon.stream()
                    .filter(conversation -> conversation.getConversationCode().equals(
                            receiverCode))
                    .collect(Collectors.toList()).size() > 0;
            if (existConversation) {
                return;
            }
        }
        AppUser receiver = userRepo.findByUserCode(receiverCode)
                .orElseThrow(() -> new RuntimeException("Not found receiver"));

        Conversation senderConversation = conversationRepo.save(
                Conversation.builder()
                        .conversationCode(receiverCode)
                        .name(receiver.getUsername())
                        .unread(0).personal(true)
                        .build());

        if (senderCon == null) {
            sender.setConversations(new LinkedHashSet<>(Arrays.asList(senderConversation)));
        } else {
            if (!existConversation) {
                sender.getConversations().add(senderConversation);
            }
        }

        userRepo.save(sender);
    }

    @Override
    public Set<Notification> getNotificationByUsername(String username) {
        // TODO Auto-generated method stub
        // AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new
        // RuntimeException("Not found user"));
        // Set<Notification> notifications = user.getNotifications();
        return notificationRepo.findByReceiverUsername(username);
    }

    @Override
    public void acceptInvite(Long id) {
        // TODO Auto-generated method stub
        Notification notification = notificationRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Not found notification."));
        Room room = roomRepo.findByRoomCode(notification.getRoomCode())
                .orElseThrow(() -> new NotFoundException("Not found room."));
        AppUser user = userRepo.findByUsername(notification.getReceiver().getUsername())
                .orElseThrow(() -> new NotFoundException("Not found user"));

        notification.setStatus(Status.ACCEPT);
        notificationRepo.save(notification);
        Conversation conversation = conversationRepo.save((Conversation.builder().conversationCode(room.getRoomCode())
                .name(room.getRoomName())
                .unread(0).personal(false)
                .build()));
        user.getConversations().add(conversation);
        room.getMembers().add(user);

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;                // Format the current date and time to ISO string
        String isoDateString = now.format(formatter);

        Message message = Message.builder()
                .identityCode(room.getRoomCode())
                .receiverCode(room.getRoomCode())
                .senderName(room.getRoomName())
                .content(user.getUsername() + " join the room.")
                .status(Status.MESSAGE)
                .toRoom(true)
                .postedTime(isoDateString)
                .build();
        messageRepo.save(message);
        simpMessagingTemplate.convertAndSend("/room/" + message.getReceiverCode(), message);

        roomRepo.save(room);
        userRepo.save(user);
    }

    @Override
    public void denyInvite(Long id) {
        // TODO Auto-generated method stub
        Notification notification = notificationRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Not found notification."));

        notification.setStatus(Status.DENY);
        notificationRepo.save(notification);

    }

}
