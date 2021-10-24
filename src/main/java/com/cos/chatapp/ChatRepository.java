package com.cos.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String> {

    // mongodb에서 찾을 데이터명
    @Tailable // 커서를 안닫고 계속 유지한다
    @Query("{sender:?0,receiver:?1}")
    Flux<Chat> mFindBySender(String sender, String receiver); // Flux == 흐름 -> 데이터를 계속 받겠다 response를 유지하면서 데이터를 계속 흘려보냄
}
