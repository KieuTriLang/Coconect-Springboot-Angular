package com.ktl.server.room;

import java.util.Set;

import com.ktl.server.user.AppUserDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class RoomDto {
    private String roomCode;
    private String roomName;
    private Set<AppUserDto> members;
}
