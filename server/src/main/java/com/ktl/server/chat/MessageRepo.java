package com.ktl.server.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {

        @Query(value = "SELECT * FROM message m WHERE m.receiver_code = :roomCode AND m.id < :id AND m.to_room = 1 ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByRoomCodeBeforeId(@Param("roomCode") String roomCode, @Param("id") Long id);

        @Query(value = "SELECT DISTINCT * FROM message m WHERE ((m.identity_code = :senderCode AND m.receiver_code = :receiverCode) OR (m.identity_code = :receiverCode AND m.receiver_code = :senderCode)) AND m.id < :id AND m.to_room = 0 ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByUserCodeBeforeId(@Param("senderCode") String senderCode,
                        @Param("receiverCode") String receiverCode, @Param("id") Long id);

        @Query(value = "SELECT * FROM message m WHERE m.receiver_code = :roomCode AND m.to_room = 1 ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByRoomCodeBegin(@Param("roomCode") String roomCode);

        @Query(value = "SELECT DISTINCT * FROM message m WHERE (m.identity_code = :senderCode AND m.receiver_code = :receiverCode) OR (m.identity_code = :receiverCode AND m.receiver_code = :senderCode) AND m.to_room = 0 ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByUserCodeBegin(@Param("senderCode") String senderCode,
                        @Param("receiverCode") String receiverCode);
}
