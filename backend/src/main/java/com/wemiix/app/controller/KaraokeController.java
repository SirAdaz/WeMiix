package com.wemiix.app.controller;

import com.wemiix.app.model.GroupMember;
import com.wemiix.app.model.KaraokeSession;
import com.wemiix.app.model.LyricsResult;
import com.wemiix.app.service.KaraokeService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/karaoke")
public class KaraokeController {

    private final KaraokeService karaokeService;

    public KaraokeController(KaraokeService karaokeService) {
        this.karaokeService = karaokeService;
    }

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public KaraokeSession startSession(@RequestBody Map<String, Object> body, Authentication authentication) {
        Long groupId = Long.valueOf(body.get("groupId").toString());
        karaokeService.requireMemberOfGroup(groupId, currentUserId(authentication));
        String trackId = (String) body.get("trackId");
        String trackName = (String) body.get("trackName");
        String artistName = (String) body.get("artistName");
        return karaokeService.startSession(groupId, trackId, trackName, artistName);
    }

    @GetMapping("/sessions/{sessionId}")
    public KaraokeSession getSession(@PathVariable String sessionId, Authentication authentication) {
        karaokeService.requireMemberOfSession(sessionId, currentUserId(authentication));
        return karaokeService.getSession(sessionId);
    }

    @PatchMapping("/sessions/{sessionId}/status")
    public KaraokeSession updateStatus(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        karaokeService.requireMemberOfSession(sessionId, currentUserId(authentication));
        KaraokeSession.Status status = KaraokeSession.Status.valueOf(body.get("status"));
        return karaokeService.updateStatus(sessionId, status);
    }

    @GetMapping("/sessions/{sessionId}/lyrics")
    public LyricsResult getLyrics(
            @PathVariable String sessionId,
            @RequestParam String artist,
            @RequestParam String title,
            Authentication authentication) {
        karaokeService.requireMemberOfSession(sessionId, currentUserId(authentication));
        return karaokeService.getLyrics(artist, title);
    }

    @PostMapping("/sessions/{sessionId}/vote")
    public KaraokeSession vote(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        GroupMember voter = karaokeService.requireMemberOfSession(sessionId, currentUserId(authentication));
        String candidateId = body.get("candidateId");
        karaokeService.requireCandidateInGroup(sessionId, candidateId);
        String voterId = String.valueOf(voter.getId());
        return karaokeService.vote(sessionId, voterId, candidateId);
    }

    /** L'identité vient du JWT : jamais d'un voterId reçu dans le corps. */
    private Long currentUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
