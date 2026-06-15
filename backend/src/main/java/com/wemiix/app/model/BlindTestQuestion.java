package com.wemiix.app.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BlindTestQuestion {

    private String trackId;
    private String trackName;
    private String artistName;
    private String previewUrl;

    private Map<String, String> answers = new HashMap<>();
    private List<String> correctAnswers = new ArrayList<>();
    private Map<String, Instant> answeredAt = new HashMap<>();

    public BlindTestQuestion() {}

    public String getTrackId() { return trackId; }
    public void setTrackId(String trackId) { this.trackId = trackId; }

    public String getTrackName() { return trackName; }
    public void setTrackName(String trackName) { this.trackName = trackName; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getPreviewUrl() { return previewUrl; }
    public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }

    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }

    public List<String> getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(List<String> correctAnswers) { this.correctAnswers = correctAnswers; }

    public Map<String, Instant> getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(Map<String, Instant> answeredAt) { this.answeredAt = answeredAt; }
}
