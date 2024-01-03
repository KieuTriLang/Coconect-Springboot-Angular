package com.ktl.server.room;

import java.util.List;

public interface RoomService {

    RoomDto createRoom(String username, RoomRequest room);

    RoomDto getRoomByRoomCode(String roomCode);

    List<MemberInfo> getRoomMembers(String roomCode);

    void addMembers(String authName, String roomCode, List<String> usernames);

    boolean promoteMember(String authName,String roomCode,String memberName);

    void removeMembers(String authName, String roomCode, List<String> usernames);

    boolean leaveRoom(String roomCode, String username);
}
