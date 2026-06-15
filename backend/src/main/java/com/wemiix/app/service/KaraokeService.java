package com.wemiix.app.service;

import com.wemiix.app.model.KaraokeSession;
import com.wemiix.app.model.LyricsResult;
import com.wemiix.app.repository.KaraokeSessionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

@Service
public class KaraokeService {

    private final KaraokeSessionRepository repository;
    private final LyricsService lyricsService;

    public KaraokeService(KaraokeSessionRepository repository, LyricsService lyricsService) {
        this.repository = repository;
        this.lyricsService = lyricsService;
    }

    public KaraokeSession startSession(Long groupId, String trackId, String trackName, String artistName) {
        KaraokeSession session = new KaraokeSession();
        session.setGroupId(groupId);
        session.setTrackId(trackId);
        session.setTrackName(trackName);
        session.setArtistName(artistName);
        session.setStatus(KaraokeSession.Status.WAITING);
        session.setStartedAt(Instant.now());
        return repository.save(session);
    }

    public KaraokeSession getSession(String sessionId) {
        return repository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Session karaoké introuvable : " + sessionId));
    }

    public KaraokeSession updateStatus(String sessionId, KaraokeSession.Status status) {
        KaraokeSession session = getSession(sessionId);
        session.setStatus(status);
        return repository.save(session);
    }

    public KaraokeSession vote(String sessionId, String voterId, String candidateId) {
        KaraokeSession session = getSession(sessionId);
        if (session.getStatus() != KaraokeSession.Status.PLAYING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Les votes ne sont acceptés que pendant la lecture");
        }
        session.getVotes().put(voterId, candidateId);
        return repository.save(session);
    }

    public KaraokeSession calculateScores(String sessionId) {
        KaraokeSession session = getSession(sessionId);
        Map<String, Integer> voteCounts = new HashMap<>();

        for (String candidateId : session.getVotes().values()) {
            voteCounts.merge(candidateId, 1, Integer::sum);
        }

        if (voteCounts.isEmpty()) return session;

        String topVoted = voteCounts.entrySet().stream()
                .max(Comparator.comparingInt(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .orElse(null);

        Map<String, Integer> scores = session.getScores();
        for (String memberId : voteCounts.keySet()) {
            int pts = memberId.equals(topVoted) ? 10 : 5;
            scores.merge(memberId, pts, Integer::sum);
        }

        return repository.save(session);
    }

    public LyricsResult getLyrics(String artist, String title) {
        LyricsResult result = lyricsService.getLyrics(artist, title);
        if (result == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paroles introuvables");
        }
        return result;
    }
}
