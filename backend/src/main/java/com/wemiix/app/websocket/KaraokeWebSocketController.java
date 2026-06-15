package com.wemiix.app.websocket;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class KaraokeWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public KaraokeWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Reçoit la position de lecture depuis un client et la diffuse à tous les
     * participants de la session karaoké.
     * Payload attendu : { "positionMs": 12345, "memberId": "..." }
     */
    @MessageMapping("/karaoke/{sessionId}/sync")
    public void syncPosition(
            @DestinationVariable String sessionId,
            @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend(
                "/topic/karaoke/" + sessionId + "/sync", payload);
    }
}
