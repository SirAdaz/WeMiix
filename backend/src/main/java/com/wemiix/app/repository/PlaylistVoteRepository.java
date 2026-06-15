package com.wemiix.app.repository;

import com.wemiix.app.model.PlaylistVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlaylistVoteRepository extends JpaRepository<PlaylistVote, Long> {

    Optional<PlaylistVote> findByTrackIdAndMemberId(Long trackId, Long memberId);

    Optional<PlaylistVote> findByTrackIdAndGuestName(Long trackId, String guestName);
}
