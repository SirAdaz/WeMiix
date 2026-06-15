package com.wemiix.app.service;

import com.wemiix.app.model.CollabPlaylist;
import com.wemiix.app.model.PlaylistTrack;
import com.wemiix.app.model.PlaylistVote;
import com.wemiix.app.repository.CollabPlaylistRepository;
import com.wemiix.app.repository.PlaylistTrackRepository;
import com.wemiix.app.repository.PlaylistVoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CollabPlaylistService {

    private static final int MAX_ADDS_PER_HOUR = 3;
    private static final int SCORE_REMOVAL_THRESHOLD = -5;

    private final CollabPlaylistRepository playlistRepository;
    private final PlaylistTrackRepository trackRepository;
    private final PlaylistVoteRepository voteRepository;

    public CollabPlaylistService(
            CollabPlaylistRepository playlistRepository,
            PlaylistTrackRepository trackRepository,
            PlaylistVoteRepository voteRepository) {
        this.playlistRepository = playlistRepository;
        this.trackRepository = trackRepository;
        this.voteRepository = voteRepository;
    }

    public CollabPlaylist createPlaylist(Long groupId, String name) {
        CollabPlaylist playlist = new CollabPlaylist();
        playlist.setGroupId(groupId);
        playlist.setName(name);
        return playlistRepository.save(playlist);
    }

    public PlaylistTrack addTrack(Long playlistId, String trackId, String trackName,
                                   String artistName, String imageUrl,
                                   Long memberId, String guestName) {
        CollabPlaylist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Playlist introuvable : " + playlistId));

        if (trackRepository.findByPlaylistIdAndTrackId(playlistId, trackId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ce morceau est déjà dans la playlist");
        }

        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        long recentAdds;
        if (memberId != null) {
            recentAdds = trackRepository.countByPlaylistIdAndAddedByMemberIdAndCreatedAtAfter(
                    playlistId, memberId, oneHourAgo);
        } else if (guestName != null) {
            recentAdds = trackRepository.countByPlaylistIdAndAddedByGuestNameAndCreatedAtAfter(
                    playlistId, guestName, oneHourAgo);
        } else {
            recentAdds = 0;
        }

        if (recentAdds >= MAX_ADDS_PER_HOUR) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Limite de " + MAX_ADDS_PER_HOUR + " ajouts par heure atteinte");
        }

        PlaylistTrack track = new PlaylistTrack();
        track.setPlaylist(playlist);
        track.setTrackId(trackId);
        track.setTrackName(trackName);
        track.setArtistName(artistName);
        track.setImageUrl(imageUrl);
        track.setAddedByMemberId(memberId);
        track.setAddedByGuestName(guestName);
        return trackRepository.save(track);
    }

    public PlaylistTrack vote(Long trackId, Long memberId, String guestName, int value) {
        if (value != 1 && value != -1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La valeur doit être +1 ou -1");
        }

        PlaylistTrack track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Morceau introuvable : " + trackId));

        if (!track.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce morceau a été retiré de la playlist");
        }

        Optional<PlaylistVote> existingVote;
        if (memberId != null) {
            existingVote = voteRepository.findByTrackIdAndMemberId(trackId, memberId);
        } else {
            existingVote = voteRepository.findByTrackIdAndGuestName(trackId, guestName);
        }

        if (existingVote.isPresent()) {
            PlaylistVote oldVote = existingVote.get();
            int diff = value - oldVote.getValue();
            track.setScore(track.getScore() + diff);
            oldVote.setValue(value);
            voteRepository.save(oldVote);
        } else {
            PlaylistVote newVote = new PlaylistVote();
            newVote.setTrack(track);
            newVote.setMemberId(memberId);
            newVote.setGuestName(guestName);
            newVote.setValue(value);
            voteRepository.save(newVote);
            track.setScore(track.getScore() + value);
            track.setVoteCount(track.getVoteCount() + 1);
        }

        if (track.getScore() <= SCORE_REMOVAL_THRESHOLD) {
            track.setActive(false);
        }

        return trackRepository.save(track);
    }

    @Transactional(readOnly = true)
    public List<PlaylistTrack> getTracks(Long playlistId) {
        if (!playlistRepository.existsById(playlistId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Playlist introuvable : " + playlistId);
        }
        return trackRepository.findByPlaylistIdAndActiveTrueOrderByScoreDesc(playlistId);
    }

    public void removeTrack(Long trackId) {
        PlaylistTrack track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Morceau introuvable : " + trackId));
        track.setActive(false);
        trackRepository.save(track);
    }
}
