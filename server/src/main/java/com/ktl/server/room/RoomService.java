package com.ktl.server.room;

import java.util.List;

public interface RoomService {

    RoomDto createRoom(String username, RoomRequest room);

    RoomDto getRoomByRoomCode(String roomCode);

    void addMembers(String roomCode, List<String> usernames);

    void removeMembers(String roomCode, List<String> usernames);
}
