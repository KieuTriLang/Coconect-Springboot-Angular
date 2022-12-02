package com.ktl.server.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {

        @Query(value = "SELECT m FROM message m WHERE m.receiverCode = :roomCode AND m.id < :id ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByRoomCodeBeforeId(@Param("roomCode") String roomCode, @Param("id") Long id);

        @Query(value = "SELECT DISTINCT m FROM message m WHERE (m.identityCode = :senderCode OR m.receiverCode = :receiverCode) AND (m.identityCode = :receiverCode OR m.receiverCode = :senderCode) AND m.id < :id ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByUserCodeBeforeId(@Param("senderCode") String senderCode,
                        @Param("receiverCode") String receiverCode, @Param("id") Long id);

        @Query(value = "SELECT m FROM message m WHERE m.receiverCode = :roomCode ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByRoomCodeBegin(@Param("roomCode") String roomCode);

        @Query(value = "SELECT DISTINCT m FROM message m WHERE (m.identityCode = :senderCode OR m.receiverCode = :receiverCode) AND (m.identityCode = :receiverCode OR m.receiverCode = :senderCode) ORDER BY m.id DESC LIMIT 50", nativeQuery = true)
        List<Message> findMessagesByUserCodeBegin(@Param("senderCode") String senderCode,
                        @Param("receiverCode") String receiverCode);
}
