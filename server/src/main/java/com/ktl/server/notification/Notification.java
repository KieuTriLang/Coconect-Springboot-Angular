package com.ktl.server.notification;

import javax.persistence.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// @AllArgsConstructor
// @NoArgsConstructor
// @Data
// @Builder
// @Entity
public class Notification {

    private Long id;
    private String name;
    private String content;
    private String time;
}
