package com.wemiix.app.repository;

import com.wemiix.app.model.PlaylistTrack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PlaylistTrackRepository extends JpaRepository<PlaylistTrack, Long> {

    List<PlaylistTrack> findByPlaylistIdAndActiveTrueOrderByScoreDesc(Long playlistId);

    Optional<PlaylistTrack> findByPlaylistIdAndTrackId(Long playlistId, String trackId);

    long countByPlaylistIdAndAddedByMemberIdAndCreatedAtAfter(Long playlistId, Long memberId, Instant after);

    long countByPlaylistIdAndAddedByGuestNameAndCreatedAtAfter(Long playlistId, String guestName, Instant after);
}
