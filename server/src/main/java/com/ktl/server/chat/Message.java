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
    private String identityCode;
    private String senderName;
    private String receiverCode;
    private String content;
    private String postedTime;
    private Status status;
}
