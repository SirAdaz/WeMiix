package com.wemiix.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.wemiix.app.model.LyricsLine;
import com.wemiix.app.model.LyricsResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LyricsService {

    private static final Logger log = LoggerFactory.getLogger(LyricsService.class);

    private static final Pattern LRC_LINE_PATTERN = Pattern.compile(
            "\\[(\\d{2}):(\\d{2})\\.(\\d{2,3})](.*)");

    private final WebClient lrclibClient;
    private final WebClient lyricsOvhClient;

    public LyricsService(
            @Value("${lyrics.lrclib-url}") String lrclibUrl,
            @Value("${lyrics.lyricsovh-url}") String lyricsOvhUrl) {
        this.lrclibClient = WebClient.builder().baseUrl(lrclibUrl).build();
        this.lyricsOvhClient = WebClient.builder().baseUrl(lyricsOvhUrl).build();
    }

    public LyricsResult getLyrics(String artist, String title) {
        try {
            LyricsResult result = fetchFromLrclib(artist, title);
            if (result != null) return result;
        } catch (Exception e) {
            log.warn("LRCLIB failed for {}/{}: {}", artist, title, e.getMessage());
        }

        try {
            return fetchFromLyricsOvh(artist, title);
        } catch (Exception e) {
            log.warn("LyricsOVH failed for {}/{}: {}", artist, title, e.getMessage());
        }

        return null;
    }

    private LyricsResult fetchFromLrclib(String artist, String title) {
        JsonNode response = lrclibClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/get")
                        .queryParam("artist_name", artist)
                        .queryParam("track_name", title)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null) return null;

        JsonNode syncedNode = response.get("syncedLyrics");
        if (syncedNode != null && !syncedNode.isNull() && !syncedNode.asText().isBlank()) {
            String lrc = syncedNode.asText();
            List<LyricsLine> lines = parseLrc(lrc);
            return new LyricsResult(lrc, true, lines);
        }

        JsonNode plainNode = response.get("plainLyrics");
        if (plainNode != null && !plainNode.isNull() && !plainNode.asText().isBlank()) {
            return new LyricsResult(plainNode.asText(), false, Collections.emptyList());
        }

        return null;
    }

    private LyricsResult fetchFromLyricsOvh(String artist, String title) {
        JsonNode response = lyricsOvhClient.get()
                .uri("/{artist}/{title}", artist, title)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null) return null;

        JsonNode lyricsNode = response.get("lyrics");
        if (lyricsNode != null && !lyricsNode.isNull() && !lyricsNode.asText().isBlank()) {
            return new LyricsResult(lyricsNode.asText(), false, Collections.emptyList());
        }

        return null;
    }

    private List<LyricsLine> parseLrc(String lrc) {
        List<LyricsLine> lines = new ArrayList<>();
        for (String rawLine : lrc.split("\n")) {
            Matcher m = LRC_LINE_PATTERN.matcher(rawLine.trim());
            if (m.matches()) {
                int minutes = Integer.parseInt(m.group(1));
                int seconds = Integer.parseInt(m.group(2));
                String centStr = m.group(3);
                int millis;
                if (centStr.length() == 3) {
                    millis = Integer.parseInt(centStr);
                } else {
                    millis = Integer.parseInt(centStr) * 10;
                }
                long timeMs = (long) minutes * 60_000 + seconds * 1_000L + millis;
                String text = m.group(4).trim();
                lines.add(new LyricsLine(timeMs, text));
            }
        }
        return lines;
    }
}
