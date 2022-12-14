package com.ktl.server.room;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.net.HttpHeaders;
import com.ktl.server.helper.AuthorizationHeaderHelper;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {
    @Autowired
    private final RoomService roomService;

    @Autowired
    private final AuthorizationHeaderHelper authorizationHeaderHelper;

    @GetMapping("/{roomCode}")
    public ResponseEntity<Object> getInfoRoom(@PathVariable String roomCode) {
        return ResponseEntity.ok(roomService.getRoomByRoomCode(roomCode));
    }

    @PostMapping("")
    public ResponseEntity<Object> createRoom(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody RoomRequest room) {
        String username = authorizationHeaderHelper.getSub(authorizationHeader);
        return ResponseEntity.ok(roomService.createRoom(username, room));
    }

    @PostMapping("/{roomCode}/members")
    public ResponseEntity<Object> addMembers(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @PathVariable String roomCode,
            @RequestParam List<String> usernames) {
        String authName = authorizationHeaderHelper.getSub(authorizationHeader);
        roomService.addMembers(authName, roomCode, usernames);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{roomCode}")
    public ResponseEntity<Object> leaveRoom(@PathVariable String roomCode,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String username = authorizationHeaderHelper.getSub(authorizationHeader);
        roomService.leaveRoom(roomCode, username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{roomCode}/members")
    public ResponseEntity<Object> removeMembers(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @PathVariable String roomCode,
            @RequestParam List<String> usernames) {
        String authName = authorizationHeaderHelper.getSub(authorizationHeader);
        roomService.removeMembers(authName, roomCode, usernames);
        return ResponseEntity.ok().build();
    }
}
