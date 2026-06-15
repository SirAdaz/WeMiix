package com.wemiix.app.model;

import java.util.List;

public record SpotifyTrack(
        String id,
        String name,
        List<String> artists,
        String albumName,
        int durationMs,
        String previewUrl,
        String imageUrl
) {}
