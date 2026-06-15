package com.wemiix.app.service;

import com.wemiix.app.model.BlindTestGame;
import com.wemiix.app.model.BlindTestQuestion;
import com.wemiix.app.repository.BlindTestGameRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class BlindTestService {

    private static final int[] SCORE_TABLE = {100, 75, 50, 25, 10};

    private final BlindTestGameRepository repository;

    public BlindTestService(BlindTestGameRepository repository) {
        this.repository = repository;
    }

    public BlindTestGame createGame(Long groupId, BlindTestGame.Mode mode, String genre, Integer year) {
        BlindTestGame game = new BlindTestGame();
        game.setGroupId(groupId);
        game.setMode(mode);
        game.setGenre(genre);
        game.setYear(year);
        game.setStatus(BlindTestGame.Status.LOBBY);
        game.setCurrentQuestionIndex(0);
        return repository.save(game);
    }

    public BlindTestGame getGame(String gameId) {
        return repository.findById(gameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Partie Blind Test introuvable : " + gameId));
    }

    public BlindTestGame submitAnswer(String gameId, String memberId, String answer) {
        BlindTestGame game = getGame(gameId);
        if (game.getStatus() != BlindTestGame.Status.PLAYING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La partie n'est pas en cours");
        }
        if (game.getCurrentQuestionIndex() >= game.getQuestions().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucune question en cours");
        }

        BlindTestQuestion question = game.getQuestions().get(game.getCurrentQuestionIndex());

        if (question.getAnswers().containsKey(memberId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous avez déjà répondu à cette question");
        }

        question.getAnswers().put(memberId, answer);
        question.getAnsweredAt().put(memberId, Instant.now());

        boolean correct = isCorrectAnswer(answer, question.getTrackName(), question.getArtistName());
        if (correct) {
            int rank = question.getCorrectAnswers().size();
            int points = rank < SCORE_TABLE.length ? SCORE_TABLE[rank] : 5;
            question.getCorrectAnswers().add(memberId);
            game.getScores().merge(memberId, points, Integer::sum);
        }

        return repository.save(game);
    }

    public BlindTestGame nextQuestion(String gameId) {
        BlindTestGame game = getGame(gameId);
        int nextIndex = game.getCurrentQuestionIndex() + 1;

        if (nextIndex >= game.getQuestions().size()) {
            game.setStatus(BlindTestGame.Status.ENDED);
        } else {
            game.setCurrentQuestionIndex(nextIndex);
            if (game.getStatus() == BlindTestGame.Status.LOBBY) {
                game.setStatus(BlindTestGame.Status.PLAYING);
            }
        }

        return repository.save(game);
    }

    public BlindTestGame endGame(String gameId) {
        BlindTestGame game = getGame(gameId);
        game.setStatus(BlindTestGame.Status.ENDED);
        return repository.save(game);
    }

    public List<Map.Entry<String, Integer>> getFinalRanking(String gameId) {
        BlindTestGame game = getGame(gameId);
        List<Map.Entry<String, Integer>> ranking = new ArrayList<>(game.getScores().entrySet());
        ranking.sort(Map.Entry.<String, Integer>comparingByValue(Comparator.reverseOrder()));
        return ranking;
    }

    private boolean isCorrectAnswer(String answer, String trackName, String artistName) {
        if (answer == null || answer.isBlank()) return false;
        String normalized = normalize(answer);
        return normalize(trackName).contains(normalized)
                || normalized.contains(normalize(trackName))
                || normalize(artistName).contains(normalized)
                || normalized.contains(normalize(artistName));
    }

    private String normalize(String s) {
        if (s == null) return "";
        return s.toLowerCase()
                .replaceAll("[àáâãäå]", "a")
                .replaceAll("[èéêë]", "e")
                .replaceAll("[ìíîï]", "i")
                .replaceAll("[òóôõö]", "o")
                .replaceAll("[ùúûü]", "u")
                .replaceAll("[^a-z0-9 ]", "")
                .trim();
    }
}
