package com.wemiix.app.controller;

import com.wemiix.app.model.CollabPlaylist;
import com.wemiix.app.model.PlaylistTrack;
import com.wemiix.app.service.CollabPlaylistService;
import org.springframework.http.HttpStatus;
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
    public CollabPlaylist createPlaylist(@RequestBody Map<String, Object> body) {
        Long groupId = Long.valueOf(body.get("groupId").toString());
        String name = (String) body.get("name");
        return playlistService.createPlaylist(groupId, name);
    }

    @GetMapping("/{playlistId}/tracks")
    public List<PlaylistTrack> getTracks(@PathVariable Long playlistId) {
        return playlistService.getTracks(playlistId);
    }

    @PostMapping("/{playlistId}/tracks")
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistTrack addTrack(
            @PathVariable Long playlistId,
            @RequestBody Map<String, Object> body) {
        String trackId = (String) body.get("trackId");
        String trackName = (String) body.get("trackName");
        String artistName = (String) body.get("artistName");
        String imageUrl = (String) body.get("imageUrl");
        Long memberId = body.get("memberId") != null
                ? Long.valueOf(body.get("memberId").toString()) : null;
        String guestName = (String) body.get("guestName");
        return playlistService.addTrack(playlistId, trackId, trackName, artistName, imageUrl, memberId, guestName);
    }

    @PostMapping("/tracks/{trackId}/vote")
    public PlaylistTrack vote(
            @PathVariable Long trackId,
            @RequestBody Map<String, Object> body) {
        Long memberId = body.get("memberId") != null
                ? Long.valueOf(body.get("memberId").toString()) : null;
        String guestName = (String) body.get("guestName");
        int value = Integer.parseInt(body.get("value").toString());
        return playlistService.vote(trackId, memberId, guestName, value);
    }

    @DeleteMapping("/tracks/{trackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeTrack(@PathVariable Long trackId) {
        playlistService.removeTrack(trackId);
    }
}
