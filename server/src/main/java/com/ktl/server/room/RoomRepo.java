package com.ktl.server.room;

import java.util.List;
import java.util.Optional;

import com.ktl.server.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomCode(String roomCode);

    boolean existsByMembers_Username(String username);

    @Query("SELECT DISTINCT u FROM Room r JOIN r.members u WHERE r.roomCode = :roomCode")
    List<AppUser> findUsernamesByRoomCode(@Param("roomCode") String roomCode);
}
