package com.wemiix.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.wemiix.app.model.SpotifyTrack;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpotifyService {

    private final WebClient webClient;

    public SpotifyService(@Value("${spotify.api-base-url}") String apiBaseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(apiBaseUrl)
                .build();
    }

    public List<SpotifyTrack> searchTracks(String query, String accessToken) {
        JsonNode response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("q", query)
                        .queryParam("type", "track")
                        .queryParam("limit", 20)
                        .build())
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        List<SpotifyTrack> tracks = new ArrayList<>();
        if (response == null) return tracks;

        JsonNode items = response.path("tracks").path("items");
        for (JsonNode item : items) {
            tracks.add(parseTrack(item));
        }
        return tracks;
    }

    public SpotifyTrack getTrack(String trackId, String accessToken) {
        JsonNode item = webClient.get()
                .uri("/tracks/{id}", trackId)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (item == null) return null;
        return parseTrack(item);
    }

    private SpotifyTrack parseTrack(JsonNode item) {
        String id = item.path("id").asText();
        String name = item.path("name").asText();

        List<String> artists = new ArrayList<>();
        for (JsonNode artist : item.path("artists")) {
            artists.add(artist.path("name").asText());
        }

        String albumName = item.path("album").path("name").asText();
        int durationMs = item.path("duration_ms").asInt();
        String previewUrl = item.path("preview_url").isNull() ? null : item.path("preview_url").asText();

        String imageUrl = null;
        JsonNode images = item.path("album").path("images");
        if (images.isArray() && !images.isEmpty()) {
            imageUrl = images.get(0).path("url").asText();
        }

        return new SpotifyTrack(id, name, artists, albumName, durationMs, previewUrl, imageUrl);
    }
}
