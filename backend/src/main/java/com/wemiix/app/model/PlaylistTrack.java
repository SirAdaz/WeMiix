package com.wemiix.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "playlist_tracks", indexes = {
        @Index(name = "idx_playlist_tracks_playlist_id", columnList = "playlist_id"),
        @Index(name = "idx_playlist_tracks_score", columnList = "score")
})
public class PlaylistTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "playlist_id", nullable = false)
    private CollabPlaylist playlist;

    @Column(nullable = false)
    private String trackId;

    @Column(nullable = false)
    private String trackName;

    @Column(nullable = false)
    private String artistName;

    private String imageUrl;

    private Long addedByMemberId;
    private String addedByGuestName;

    @Column(nullable = false)
    private int score = 0;

    @Column(nullable = false)
    private int voteCount = 0;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public PlaylistTrack() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CollabPlaylist getPlaylist() { return playlist; }
    public void setPlaylist(CollabPlaylist playlist) { this.playlist = playlist; }

    public String getTrackId() { return trackId; }
    public void setTrackId(String trackId) { this.trackId = trackId; }

    public String getTrackName() { return trackName; }
    public void setTrackName(String trackName) { this.trackName = trackName; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Long getAddedByMemberId() { return addedByMemberId; }
    public void setAddedByMemberId(Long addedByMemberId) { this.addedByMemberId = addedByMemberId; }

    public String getAddedByGuestName() { return addedByGuestName; }
    public void setAddedByGuestName(String addedByGuestName) { this.addedByGuestName = addedByGuestName; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getVoteCount() { return voteCount; }
    public void setVoteCount(int voteCount) { this.voteCount = voteCount; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
