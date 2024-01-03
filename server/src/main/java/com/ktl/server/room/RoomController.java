package com.ktl.server.room;

import com.ktl.server.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {
    private final RoomService roomService;

    private final JwtService jwtService;

    @GetMapping("/{roomCode}")
    public ResponseEntity<RoomDto> getInfoRoom(@PathVariable String roomCode) {
        return ResponseEntity.ok(roomService.getRoomByRoomCode(roomCode));
    }
    @GetMapping("/{roomCode}/members")
    public ResponseEntity<List<MemberInfo>> getRoomMember(@PathVariable String roomCode) {
        return ResponseEntity.ok(roomService.getRoomMembers(roomCode));
    }

    @PostMapping("")
    public ResponseEntity<Object> createRoom(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @RequestBody RoomRequest room) {
        String username = jwtService.extractUsername(authHeader.replace("Bearer ",""));
        return ResponseEntity.ok(roomService.createRoom(username, room));
    }

    @PostMapping("/{roomCode}/members")
    public ResponseEntity<Object> addMembers(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable String roomCode,
            @RequestParam List<String> usernames) {
        String authName = jwtService.extractUsername(authHeader.replace("Bearer ",""));
        roomService.addMembers(authName, roomCode, usernames);

        return ResponseEntity.ok().build();
    }
    @PostMapping("/{roomCode}/members/{memberName}/promote")
    public ResponseEntity<Boolean> promoteMember(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable String roomCode,
            @PathVariable String memberName
    ){
        String authName = jwtService.extractUsername(authHeader.replace("Bearer ",""));

        return ResponseEntity.ok(roomService.promoteMember(authName, roomCode, memberName));
    }

    @DeleteMapping("/{roomCode}")
    public ResponseEntity<Boolean> leaveRoom(@PathVariable String roomCode,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String username = jwtService.extractUsername(authHeader.replace("Bearer ",""));

        return ResponseEntity.ok(roomService.leaveRoom(roomCode, username));
    }

    @DeleteMapping("/{roomCode}/members")
    public ResponseEntity<Object> removeMembers(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable String roomCode,
            @RequestParam List<String> usernames) {
        String authName = jwtService.extractUsername(authHeader.replace("Bearer ",""));
        roomService.removeMembers(authName, roomCode, usernames);
        return ResponseEntity.ok().build();
    }
}
