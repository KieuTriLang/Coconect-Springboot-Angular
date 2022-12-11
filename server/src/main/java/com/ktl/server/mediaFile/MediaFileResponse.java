package com.ktl.server.mediaFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MediaFileResponse {
    private String fileCode;
    private String type;
}
