package com.ktl.server.mediaFile;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface MediaFileService {

    MediaFile saveFile(MultipartFile file) throws IOException;

    MediaFile getFileByFileCode(String fileCode);
}
