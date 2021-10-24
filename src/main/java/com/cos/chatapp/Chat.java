package com.cos.chatapp;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "chat") //collection 이름 설정
public class Chat {
    // mongoDB id default type 은 Bson type 임
    @Id
    private String id;
    private String msg;
    private String sender;
    private String receiver;

    private LocalDateTime createAt;
}
