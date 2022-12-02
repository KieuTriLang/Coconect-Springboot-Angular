package com.ktl.server.mediaFile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaFileRepo extends JpaRepository<MediaFile, Long> {

}
