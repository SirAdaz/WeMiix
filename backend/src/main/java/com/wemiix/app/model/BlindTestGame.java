package com.wemiix.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "blindtest_games")
public class BlindTestGame {

    @Id
    private String id;

    private Long groupId;
    private Mode mode;
    private String genre;
    private Integer year;

    private List<BlindTestQuestion> questions = new ArrayList<>();
    private int currentQuestionIndex;
    private Status status;

    private Map<String, Integer> scores = new HashMap<>();

    public enum Mode {
        RANDOM, GENRE, YEAR, CUSTOM
    }

    public enum Status {
        LOBBY, PLAYING, ENDED
    }

    public BlindTestGame() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }

    public Mode getMode() { return mode; }
    public void setMode(Mode mode) { this.mode = mode; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public List<BlindTestQuestion> getQuestions() { return questions; }
    public void setQuestions(List<BlindTestQuestion> questions) { this.questions = questions; }

    public int getCurrentQuestionIndex() { return currentQuestionIndex; }
    public void setCurrentQuestionIndex(int currentQuestionIndex) { this.currentQuestionIndex = currentQuestionIndex; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Map<String, Integer> getScores() { return scores; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }
}
