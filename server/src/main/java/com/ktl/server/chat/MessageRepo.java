package com.ktl.server.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {

        @Query(value = "SELECT * FROM message m WHERE m.receiver_code = :roomCode AND m.id < :id ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByRoomCodeBeforeId(@Param("roomCode") String roomCode, @Param("id") Long id);

        @Query(value = "SELECT DISTINCT * FROM message m WHERE (m.identity_code = :senderCode OR m.receiver_code = :receiverCode) AND (m.identity_code = :receiverCode OR m.receiver_code = :senderCode) AND m.id < :id ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByUserCodeBeforeId(@Param("senderCode") String senderCode,
                        @Param("receiverCode") String receiverCode, @Param("id") Long id);

        @Query(value = "SELECT * FROM message m WHERE m.receiver_code = :roomCode ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByRoomCodeBegin(@Param("roomCode") String roomCode);

        @Query(value = "SELECT DISTINCT * FROM message m WHERE (m.identity_code = :senderCode OR m.receiver_code = :receiverCode) AND (m.identity_code = :receiverCode OR m.receiver_code = :senderCode) ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByUserCodeBegin(@Param("senderCode") String senderCode,
                        @Param("receiverCode") String receiverCode);
}
