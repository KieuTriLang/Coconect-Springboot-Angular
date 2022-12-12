package com.ktl.server.notification;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {

    Optional<Notification> findByReceiverUsernameAndRoomCode(String username, String roomCode);

    Set<Notification> findByReceiverUsername(String username);
}
