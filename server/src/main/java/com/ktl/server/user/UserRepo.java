package com.ktl.server.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsername(String username);

    Optional<AppUser> findByUserCode(String userCode);
}
