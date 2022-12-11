package com.ktl.server.user;

import java.util.List;
import java.util.Set;

import com.ktl.server.conversation.ConversationResponse;
import com.ktl.server.home.RegisterRequest;
import com.ktl.server.notification.Notification;

public interface UserService {

    void register(RegisterRequest registerRequest);

    AppUserDto getInfoUserByUserCode(String userCode);

    AppUserDto getInfoUserByUsername(String username);

    void addPrivateConversation(String senderCode, String receiverCode);

    Set<Notification> getNotificationByUsername(String username);

}
