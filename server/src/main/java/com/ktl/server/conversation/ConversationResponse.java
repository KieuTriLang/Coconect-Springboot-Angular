package com.ktl.server.conversation;

import java.util.Set;

import com.ktl.server.chat.Message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ConversationResponse {

    private Conversation conversation;
    private Set<Message> messages;
}
