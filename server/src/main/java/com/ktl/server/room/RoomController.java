package com.ktl.server.room;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {
    @Autowired
    private final RoomService roomService;

    @GetMapping("/{roomCode}")
    public ResponseEntity<Object> getInfoRoom(@PathVariable String roomCode) {
        return ResponseEntity.ok(roomService.getRoomByRoomCode(roomCode));
    }

    @PostMapping("")
    public ResponseEntity<Object> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.saveRoom(room));
    }

    @PostMapping("/{roomCode}/members")
    public ResponseEntity<Object> addMembers(@PathVariable String roomCode, @RequestParam List<String> usernames) {
        roomService.addMembers(roomCode, usernames);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{roomCode}/members")
    public ResponseEntity<Object> deleteMembers(@PathVariable String roomCode, @RequestParam List<String> usernames) {
        roomService.deleteMembers(roomCode, usernames);
        return ResponseEntity.ok().build();
    }
}
