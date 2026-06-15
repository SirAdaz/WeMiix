package com.wemiix.app.websocket;

import com.wemiix.app.model.BlindTestGame;
import com.wemiix.app.service.BlindTestService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class BlindTestWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final BlindTestService blindTestService;

    public BlindTestWebSocketController(
            SimpMessagingTemplate messagingTemplate,
            BlindTestService blindTestService) {
        this.messagingTemplate = messagingTemplate;
        this.blindTestService = blindTestService;
    }

    /**
     * Reçoit une réponse d'un membre, la traite et diffuse le résultat à tous.
     * Payload attendu : { "memberId": "...", "answer": "..." }
     */
    @MessageMapping("/blindtest/{gameId}/answer")
    public void submitAnswer(
            @DestinationVariable String gameId,
            @Payload Map<String, String> payload) {
        String memberId = payload.get("memberId");
        String answer = payload.get("answer");

        BlindTestGame updatedGame = blindTestService.submitAnswer(gameId, memberId, answer);

        messagingTemplate.convertAndSend(
                "/topic/blindtest/" + gameId + "/answers",
                Map.of("game", updatedGame, "lastAnswer", payload));
    }

    /**
     * Passe à la question suivante et diffuse l'état mis à jour.
     * Payload attendu : {} (vide, déclenché par l'hôte)
     */
    @MessageMapping("/blindtest/{gameId}/next")
    public void nextQuestion(
            @DestinationVariable String gameId,
            @Payload Map<String, Object> payload) {
        BlindTestGame updatedGame = blindTestService.nextQuestion(gameId);

        messagingTemplate.convertAndSend(
                "/topic/blindtest/" + gameId + "/next",
                Map.of("game", updatedGame,
                        "currentQuestionIndex", updatedGame.getCurrentQuestionIndex(),
                        "status", updatedGame.getStatus().name()));
    }
}
