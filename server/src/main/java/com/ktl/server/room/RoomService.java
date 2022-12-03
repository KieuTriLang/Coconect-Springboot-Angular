package com.ktl.server.room;

import java.util.List;

public interface RoomService {

    RoomDto createRoom(String username, Room room);

    RoomDto getRoomByRoomCode(String roomCode);

    void addMembers(String roomCode, List<String> usernames);

    void deleteMembers(String roomCode, List<String> usernames);
}
