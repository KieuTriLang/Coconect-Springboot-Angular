package com.ktl.server.user;

import java.util.List;

import com.ktl.server.conversation.ConversationResponse;
import com.ktl.server.home.RegisterRequest;

public interface UserService {

    void register(RegisterRequest registerRequest);

    AppUserDto getInfoUserByUserCode(String userCode);

    AppUserDto getInfoUserByUsername(String username);

    void addPrivateConversation(String senderCode, String receiverCode);

    List<ConversationResponse> getConversations(String username);
}
