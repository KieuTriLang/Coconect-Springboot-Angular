package com.ktl.server.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepo extends JpaRepository<Token,Long> {
    Optional<Token> findByContent(String content);
    List<Token> findByOwner_UsernameAndExpiredFalseAndRevokedFalse(String username);
}
