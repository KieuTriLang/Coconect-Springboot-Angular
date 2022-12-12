package com.ktl.server.user;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
@AllArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private final UserRepo userRepo;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final ConversationRepo conversationRepo;
    @Autowired
    private final MessageRepo messageRepo;
    @Autowired
    private final RoomRepo roomRepo;
    @Autowired
    private final NotificationRepo notificationRepo;
    @Autowired
    private final ModelMapper modelMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("Not found username"));
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                authorities);
    }

    @Override
    public void register(RegisterRequest registerRequest) {
        try {
            AppUser user = AppUser.builder()
                    .userCode(UUID.randomUUID().toString())
                    .username(registerRequest.getUsername())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .role(USER)
                    .conversations(new LinkedHashSet<>()).build();

            userRepo.save(user);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public AppUserDto getInfoUserByUserCode(String userCode) {
        // TODO Auto-generated method stub
        AppUser user = userRepo.findByUserCode(userCode).orElseThrow(() -> new RuntimeException("User not found"));
        return modelMapper.map(user, AppUserDto.class);
    }

    @Override
    public AppUserDto getInfoUserByUsername(String username) {
        // TODO Auto-generated method stub
        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user.getConversations();
        return modelMapper.map(user, AppUserDto.class);
    }

    @Override
    public void addPrivateConversation(String senderCode, String receiverCode) {
        // TODO Auto-generated method stub
        AppUser sender = userRepo.findByUserCode(senderCode)
                .orElseThrow(() -> new RuntimeException("Not found sender"));

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
    public void acceptInvite(String username, String roomCode) {
        // TODO Auto-generated method stub
        Notification notification = notificationRepo.findByReceiverUsernameAndRoomCode(username, roomCode)
                .orElseThrow(() -> new RuntimeException("Error"));
        Room room = roomRepo.findByRoomCode(roomCode).orElseThrow(() -> new RuntimeException("Error"));
        AppUser user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("Error"));

        notification.setStatus(Status.ACCEPT);
        notificationRepo.save(notification);
        Conversation conversation = conversationRepo.save((Conversation.builder().conversationCode(roomCode)
                .name(room.getRoomName())
                .unread(0).personal(false)
                .build()));
        user.getConversations().add(conversation);
        room.getMembers().add(user);

        roomRepo.save(room);
        userRepo.save(user);
    }

    @Override
    public void denyInvite(String username, String roomCode) {
        // TODO Auto-generated method stub
        Notification notification = notificationRepo.findByReceiverUsernameAndRoomCode(username, roomCode)
                .orElseThrow(() -> new RuntimeException("Error"));

        notification.setStatus(Status.DENY);
        notificationRepo.save(notification);

    }

}
