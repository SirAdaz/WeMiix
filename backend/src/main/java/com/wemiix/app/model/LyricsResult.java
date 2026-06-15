package com.wemiix.app.model;

import java.util.List;

public record LyricsResult(
        String lyrics,
        boolean synced,
        List<LyricsLine> lines
) {}
