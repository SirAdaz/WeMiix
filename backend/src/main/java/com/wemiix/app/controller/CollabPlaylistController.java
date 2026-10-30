package com.wemiix.app.controller;

import com.wemiix.app.model.CollabPlaylist;
import com.wemiix.app.model.GroupMember;
import com.wemiix.app.model.PlaylistTrack;
import com.wemiix.app.service.CollabPlaylistService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/playlists")
public class CollabPlaylistController {

    private final CollabPlaylistService playlistService;

    public CollabPlaylistController(CollabPlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public CollabPlaylist createPlaylist(@RequestBody Map<String, Object> body, Authentication authentication) {
        Long groupId = Long.valueOf(body.get("groupId").toString());
        playlistService.requireMemberOfGroup(groupId, currentUserId(authentication));
        String name = (String) body.get("name");
        return playlistService.createPlaylist(groupId, name);
    }

    @GetMapping("/{playlistId}/tracks")
    public List<PlaylistTrack> getTracks(@PathVariable Long playlistId, Authentication authentication) {
        playlistService.requireMemberOfPlaylist(playlistId, currentUserId(authentication));
        return playlistService.getTracks(playlistId);
    }

    @PostMapping("/{playlistId}/tracks")
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistTrack addTrack(
            @PathVariable Long playlistId,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        GroupMember member = playlistService.requireMemberOfPlaylist(playlistId, currentUserId(authentication));
        String trackId = (String) body.get("trackId");
        String trackName = (String) body.get("trackName");
        String artistName = (String) body.get("artistName");
        String imageUrl = (String) body.get("imageUrl");
        return playlistService.addTrack(playlistId, trackId, trackName, artistName, imageUrl, member.getId(), null);
    }

    @PostMapping("/tracks/{trackId}/vote")
    public PlaylistTrack vote(
            @PathVariable Long trackId,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        GroupMember member = playlistService.requireMemberOfTrack(trackId, currentUserId(authentication));
        int value = Integer.parseInt(body.get("value").toString());
        return playlistService.vote(trackId, member.getId(), null, value);
    }

    @DeleteMapping("/tracks/{trackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeTrack(@PathVariable Long trackId, Authentication authentication) {
        GroupMember member = playlistService.requireMemberOfTrack(trackId, currentUserId(authentication));
        playlistService.removeTrack(trackId, member);
    }

    /** L'identité vient du JWT : jamais d'un memberId ou d'un nom reçu dans le corps. */
    private Long currentUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
