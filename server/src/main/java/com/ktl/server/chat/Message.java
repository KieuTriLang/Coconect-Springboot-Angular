package com.ktl.server.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class Message {
    private String indentityCode;
    private String senderName;
    private String receiverName;
    private String content;
    private String date;
    private Status status;
}
