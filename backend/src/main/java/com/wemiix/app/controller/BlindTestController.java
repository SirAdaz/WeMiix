package com.wemiix.app.controller;

import com.wemiix.app.model.BlindTestGame;
import com.wemiix.app.model.GroupMember;
import com.wemiix.app.service.BlindTestService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blindtest")
public class BlindTestController {

    private final BlindTestService blindTestService;

    public BlindTestController(BlindTestService blindTestService) {
        this.blindTestService = blindTestService;
    }

    @PostMapping("/games")
    @ResponseStatus(HttpStatus.CREATED)
    public BlindTestGame createGame(@RequestBody Map<String, Object> body, Authentication authentication) {
        Long groupId = Long.valueOf(body.get("groupId").toString());
        blindTestService.requireMemberOfGroup(groupId, currentUserId(authentication));
        BlindTestGame.Mode mode = BlindTestGame.Mode.valueOf(
                body.getOrDefault("mode", "RANDOM").toString());
        String genre = (String) body.get("genre");
        Integer year = body.get("year") != null ? Integer.parseInt(body.get("year").toString()) : null;
        return blindTestService.createGame(groupId, mode, genre, year);
    }

    @GetMapping("/games/{gameId}")
    public BlindTestGame getGame(@PathVariable String gameId, Authentication authentication) {
        blindTestService.requireMemberOfGame(gameId, currentUserId(authentication));
        return blindTestService.getGame(gameId);
    }

    @PostMapping("/games/{gameId}/answer")
    public BlindTestGame submitAnswer(
            @PathVariable String gameId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        GroupMember member = blindTestService.requireMemberOfGame(gameId, currentUserId(authentication));
        String memberId = String.valueOf(member.getId());
        String answer = body.get("answer");
        return blindTestService.submitAnswer(gameId, memberId, answer);
    }

    @PostMapping("/games/{gameId}/next")
    public BlindTestGame nextQuestion(@PathVariable String gameId, Authentication authentication) {
        blindTestService.requireMemberOfGame(gameId, currentUserId(authentication));
        return blindTestService.nextQuestion(gameId);
    }

    @PostMapping("/games/{gameId}/end")
    public Map<String, Object> endGame(@PathVariable String gameId, Authentication authentication) {
        blindTestService.requireMemberOfGame(gameId, currentUserId(authentication));
        BlindTestGame game = blindTestService.endGame(gameId);
        List<Map.Entry<String, Integer>> ranking = blindTestService.getFinalRanking(gameId);
        return Map.of("game", game, "ranking", ranking);
    }

    /** L'identité vient du JWT : jamais d'un memberId reçu dans le corps. */
    private Long currentUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
