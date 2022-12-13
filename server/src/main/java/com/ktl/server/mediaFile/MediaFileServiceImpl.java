package com.ktl.server.mediaFile;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MediaFileServiceImpl implements MediaFileService {
    @Autowired
    private final MediaFileRepo mediaFileRepo;

    @Override
    public MediaFile saveFile(MultipartFile file) throws IOException {
        // TODO Auto-generated method stub
        if (file.getSize() > 419_430_400) {
            throw new RuntimeException("File too big");
        }
        MediaFile mediaFile = MediaFile.builder()
                .code(UUID.randomUUID().toString())
                .name(file.getName())
                .type(file.getContentType())
                .data(file.getBytes())
                .size(file.getSize())
                .build();
        return mediaFileRepo.save(mediaFile);
    }

    @Override
    public MediaFile getFileByFileCode(String fileCode) {
        // TODO Auto-generated method stub
        return mediaFileRepo.findByCode(fileCode).orElseThrow(() -> new RuntimeException("Not found file"));
    }

}
