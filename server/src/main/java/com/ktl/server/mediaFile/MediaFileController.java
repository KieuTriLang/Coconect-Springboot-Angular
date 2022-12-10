package com.ktl.server.mediaFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.net.HttpHeaders;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/media-file")
@AllArgsConstructor
public class MediaFileController {

    @Autowired
    private final MediaFileService mediaFileService;

    // FILE
    @GetMapping("/image/{fileCode}")
    public ResponseEntity<InputStreamResource> getFile(@PathVariable String fileCode) {
        MediaFile file = mediaFileService.getFileByFileCode(fileCode);
        InputStream is = new ByteArrayInputStream(file.getData());
        MediaType mediaType = MediaType.valueOf(file.getType());
        return ResponseEntity.ok().contentType(mediaType).body(new InputStreamResource(is));
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> saveFile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestPart(required = false) MultipartFile file) throws IOException {

        return ResponseEntity.ok(mediaFileService.saveFile(file));
    }

    @GetMapping("/image/{fileCode}/download")
    public ResponseEntity<Object> downloadFile(@PathVariable String fileCode) {
        return ResponseEntity.ok().build();
    }

    // VIDEO
    @GetMapping("/video/{fileCode}")
    public ResponseEntity<Object> getVideo(@PathVariable String fileCode) {
        MediaFile file = mediaFileService.getFileByFileCode(fileCode);
        InputStream is = new ByteArrayInputStream(file.getData());
        MediaType mediaType = MediaType.valueOf(file.getType());
        return ResponseEntity.ok().contentType(mediaType).body(new InputStreamResource(is));
    }

    @PostMapping(value = "/video", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Object> saveVideo(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestPart(required = false) MultipartFile file) throws IOException {

        return ResponseEntity.ok(mediaFileService.saveFile(file));
    }

    @GetMapping("/video/{fileCode}/download")
    public ResponseEntity<Object> downloadVideo(@PathVariable String fileCode) {
        return ResponseEntity.ok().build();
    }
}
