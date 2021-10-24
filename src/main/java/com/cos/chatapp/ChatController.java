package com.cos.chatapp;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@RestController // 데이터 리턴 서버
public class ChatController {

    private final ChatRepository chatRepository;

    // MediaType.TEXT_EVENT_STREAM_VALUE : 응답을 한번하고 끊지 않고 지속적으로 받을때 사용 return type이 flux가 되어야함
    @GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> getMsg(@PathVariable String sender, @PathVariable String receiver) {
        // Flux : 데이터를 지속적으로 여러번 리턴
        return chatRepository.mFindBySender(sender, receiver).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping("/chat")
    public Mono<Chat> setMsg(@RequestBody Chat chat) {
        // Mono : 데이터를 한번만 리턴
        chat.setCreateAt((LocalDateTime.now()));
        return chatRepository.save(chat);
    }
}
