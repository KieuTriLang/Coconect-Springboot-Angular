package com.ktl.server.room;

import java.util.List;

public interface RoomService {

    String saveRoom(Room room);

    Room getRoomByRoomCode(String roomCode);

    void addMembers(String roomCode, List<String> usernames);

    void deleteMembers(String roomCode, List<String> usernames);
}
