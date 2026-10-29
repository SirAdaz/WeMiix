package com.wemiix.app.service;

import com.wemiix.app.model.RefreshToken;
import com.wemiix.app.model.User;
import com.wemiix.app.repository.RefreshTokenRepository;
import com.wemiix.app.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private static final long ACCESS_TOKEN_EXPIRATION = 900L;    // 15 minutes
    private static final long REFRESH_TOKEN_EXPIRATION = 604800L; // 7 jours
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }

    public record AuthTokens(String accessToken, String refreshToken, User user) {}

    @Transactional
    public AuthTokens register(String email, String username, String password) {
        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Le mot de passe doit faire au moins " + MIN_PASSWORD_LENGTH + " caractères");
        }
        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe déjà avec cet e-mail");
        }
        User user = new User();
        user.setEmail(normalizedEmail);
        user.setUsername(username.trim());
        user.setDisplayName(username.trim());
        user.setPasswordHash(passwordEncoder.encode(password));
        return issueTokens(userRepository.save(user));
    }

    @Transactional
    public AuthTokens login(String email, String password) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
            .filter(found -> found.getPasswordHash() != null)
            .filter(found -> passwordEncoder.matches(password, found.getPasswordHash()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou mot de passe incorrect"));
        return issueTokens(user);
    }

    /** Invité : compte jetable sans e-mail réel, pour jouer sans inscription. */
    @Transactional
    public AuthTokens guest(String username) {
        User user = new User();
        user.setEmail("guest-" + UUID.randomUUID() + "@guest.wemiix.invalid");
        user.setUsername(username.trim());
        user.setDisplayName(username.trim());
        user.setGuest(true);
        return issueTokens(userRepository.save(user));
    }

    private AuthTokens issueTokens(User user) {
        String accessToken = jwtService.generateToken(user.getId(), user.getEmail(), ACCESS_TOKEN_EXPIRATION);
        return new AuthTokens(accessToken, persistRefreshToken(user.getId()), user);
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
