package com.wemiix.app.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.wemiix.app.model.User;
import com.wemiix.app.repository.UserRepository;
import com.wemiix.app.service.AuthService;
import com.wemiix.app.service.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String SPOTIFY_REDIRECT_URI = "http://localhost:8080/api/auth/spotify/callback";
    private static final String FRONTEND_CALLBACK_URI = "http://localhost:3000/auth/callback";
    private static final String SPOTIFY_SCOPES = "streaming user-read-email user-read-private";

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final String spotifyClientId;
    private final String spotifyClientSecret;
    private final String spotifyTokenUrl;
    private final String spotifyProfileUrl;
    private final WebClient webClient;

    public AuthController(AuthService authService,
                          JwtService jwtService,
                          UserRepository userRepository,
                          @Value("${spotify.client-id}") String spotifyClientId,
                          @Value("${spotify.client-secret}") String spotifyClientSecret,
                          @Value("${spotify.auth-url}") String spotifyAuthUrl,
                          @Value("${spotify.api-base-url}") String spotifyApiBaseUrl) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.spotifyClientId = spotifyClientId;
        this.spotifyClientSecret = spotifyClientSecret;
        this.spotifyTokenUrl = spotifyAuthUrl + "/api/token";
        this.spotifyProfileUrl = spotifyApiBaseUrl + "/me";
        this.webClient = WebClient.create();
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────

    record LoginRequest(String email, String username) {}
    record RefreshRequest(String refreshToken) {}
    record AuthResponse(String accessToken, String refreshToken, User user) {}

    // ── Endpoints ─────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest body) {
        if (!StringUtils.hasText(body.email()) || !StringUtils.hasText(body.username())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email et username sont requis");
        }
        AuthService.AuthTokens tokens = authService.loginOrRegister(body.email(), body.username());
        return ResponseEntity.ok(new AuthResponse(tokens.accessToken(), tokens.refreshToken(), tokens.user()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest body) {
        if (!StringUtils.hasText(body.refreshToken())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "refreshToken est requis");
        }
        AuthService.AuthTokens tokens = authService.refreshTokens(body.refreshToken());
        return ResponseEntity.ok(new AuthResponse(tokens.accessToken(), tokens.refreshToken(), tokens.user()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        Long userId = extractUserIdFromHeader(authHeader);
        authService.logout(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        Long userId = extractUserIdFromHeader(authHeader);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/spotify/authorize")
    public ResponseEntity<Map<String, String>> spotifyAuthorize() {
        String url = "https://accounts.spotify.com/authorize"
            + "?client_id=" + spotifyClientId
            + "&response_type=code"
            + "&redirect_uri=" + SPOTIFY_REDIRECT_URI
            + "&scope=" + SPOTIFY_SCOPES.replace(" ", "%20");
        return ResponseEntity.ok(Map.of("authorizationUrl", url));
    }

    @GetMapping("/spotify/callback")
    public ResponseEntity<Void> spotifyCallback(@RequestParam String code) {
        String credentials = Base64.getEncoder().encodeToString(
            (spotifyClientId + ":" + spotifyClientSecret).getBytes(StandardCharsets.UTF_8)
        );

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("code", code);
        formData.add("redirect_uri", SPOTIFY_REDIRECT_URI);

        JsonNode tokenResponse = webClient.post()
            .uri(spotifyTokenUrl)
            .header(HttpHeaders.AUTHORIZATION, "Basic " + credentials)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(BodyInserters.fromFormData(formData))
            .retrieve()
            .bodyToMono(JsonNode.class)
            .block();

        if (tokenResponse == null || !tokenResponse.has("access_token")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Échange de code Spotify échoué");
        }

        String spotifyAccessToken = tokenResponse.path("access_token").asText();
        String spotifyRefreshToken = tokenResponse.path("refresh_token").asText("");

        JsonNode profile = webClient.get()
            .uri(spotifyProfileUrl)
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + spotifyAccessToken)
            .retrieve()
            .bodyToMono(JsonNode.class)
            .block();

        if (profile == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Impossible de récupérer le profil Spotify");
        }

        String spotifyId = profile.path("id").asText();
        String email = profile.path("email").asText();
        String displayName = profile.path("display_name").asText(spotifyId);

        AuthService.AuthTokens tokens = authService.spotifyCallback(
            spotifyId, email, displayName, spotifyAccessToken, spotifyRefreshToken
        );

        URI redirectUri = URI.create(FRONTEND_CALLBACK_URI + "?token=" + tokens.accessToken());
        return ResponseEntity.status(HttpStatus.FOUND)
            .location(redirectUri)
            .build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Long extractUserIdFromHeader(String authHeader) {
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token manquant ou malformé");
        }
        String token = authHeader.substring(7);
        return jwtService.validateToken(token)
            .map(JwtService.Claims::userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token invalide ou expiré"));
    }
}
