package com.wemiix.app.service;

import com.wemiix.app.model.RefreshToken;
import com.wemiix.app.model.User;
import com.wemiix.app.repository.RefreshTokenRepository;
import com.wemiix.app.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private static final long ACCESS_TOKEN_EXPIRATION = 900L;    // 15 minutes
    private static final long REFRESH_TOKEN_EXPIRATION = 604800L; // 7 jours

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }

    public record AuthTokens(String accessToken, String refreshToken, User user) {}

    @Transactional
    public AuthTokens loginOrRegister(String email, String username) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(username);
            newUser.setDisplayName(username);
            return userRepository.save(newUser);
        });

        String accessToken = jwtService.generateToken(user.getId(), user.getEmail(), ACCESS_TOKEN_EXPIRATION);
        String refreshToken = persistRefreshToken(user.getId());

        return new AuthTokens(accessToken, refreshToken, user);
    }

    @Transactional
    public AuthTokens refreshTokens(String refreshTokenValue) {
        RefreshToken stored = refreshTokenRepository.findByToken(refreshTokenValue)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalide"));

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(stored);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expiré");
        }

        User user = userRepository.findById(stored.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur introuvable"));

        refreshTokenRepository.delete(stored);

        String newAccessToken = jwtService.generateToken(user.getId(), user.getEmail(), ACCESS_TOKEN_EXPIRATION);
        String newRefreshToken = persistRefreshToken(user.getId());

        return new AuthTokens(newAccessToken, newRefreshToken, user);
    }

    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Transactional
    public AuthTokens spotifyCallback(String spotifyId, String email, String displayName,
                                      String spotifyAccessToken, String spotifyRefreshToken) {
        User user = userRepository.findBySpotifyId(spotifyId)
            .orElseGet(() -> userRepository.findByEmail(email)
                .map(existing -> {
                    existing.setSpotifyId(spotifyId);
                    existing.setDisplayName(displayName);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setSpotifyId(spotifyId);
                    newUser.setEmail(email);
                    newUser.setUsername(displayName);
                    newUser.setDisplayName(displayName);
                    return userRepository.save(newUser);
                })
            );

        String accessToken = jwtService.generateToken(user.getId(), user.getEmail(), ACCESS_TOKEN_EXPIRATION);
        String refreshToken = persistRefreshToken(user.getId());

        return new AuthTokens(accessToken, refreshToken, user);
    }

    private String persistRefreshToken(Long userId) {
        String value = UUID.randomUUID().toString();
        RefreshToken rt = new RefreshToken();
        rt.setToken(value);
        rt.setUserId(userId);
        rt.setExpiresAt(Instant.now().plusSeconds(REFRESH_TOKEN_EXPIRATION));
        refreshTokenRepository.save(rt);
        return value;
    }
}
