package com.wemiix.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "karaoke_sessions")
public class KaraokeSession {

    @Id
    private String id;

    private Long groupId;
    private String trackId;
    private String trackName;
    private String artistName;
    private Status status;
    private Instant startedAt;

    private Map<String, String> votes = new HashMap<>();
    private Map<String, Integer> scores = new HashMap<>();

    public enum Status {
        WAITING, PLAYING, PAUSED, ENDED
    }

    public KaraokeSession() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }

    public String getTrackId() { return trackId; }
    public void setTrackId(String trackId) { this.trackId = trackId; }

    public String getTrackName() { return trackName; }
    public void setTrackName(String trackName) { this.trackName = trackName; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Map<String, String> getVotes() { return votes; }
    public void setVotes(Map<String, String> votes) { this.votes = votes; }

    public Map<String, Integer> getScores() { return scores; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }
}
