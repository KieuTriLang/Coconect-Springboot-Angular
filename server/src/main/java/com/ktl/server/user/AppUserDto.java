package com.ktl.server.user;

import java.util.Set;

import com.ktl.server.conversation.Conversation;
import com.ktl.server.room.RoomDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AppUserDto {
    private String userCode;
    private String username;
    private Set<Conversation> conversations;

}
