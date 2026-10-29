package com.wemiix.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wemiix.app.config.JwtConfig;
import com.wemiix.app.model.User;
import com.wemiix.app.repository.RefreshTokenRepository;
import com.wemiix.app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private static final String EMAIL = "alice@example.test";
    private static final String PASSWORD = "motdepasse-solide";

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private UserRepository userRepository;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        when(userRepository.save(any(User.class))).thenAnswer(call -> {
            User saved = call.getArgument(0);
            saved.setId(1L);
            return saved;
        });
        JwtService jwtService = new JwtService(
                new JwtConfig("test-secret-at-least-32-characters-long", 900L), new ObjectMapper());
        authService = new AuthService(userRepository, mock(RefreshTokenRepository.class), jwtService, passwordEncoder);
    }

    @Test
    void registerStoresAHashNotThePassword() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        User user = authService.register("Alice@Example.test", "alice", PASSWORD).user();

        assertEquals(EMAIL, user.getEmail());
        assertNotEquals(PASSWORD, user.getPasswordHash());
        assertEquals(true, passwordEncoder.matches(PASSWORD, user.getPasswordHash()));
    }

    @Test
    void registerRejectsAShortPassword() {
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> authService.register(EMAIL, "alice", "court"));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
    }

    @Test
    void registerRejectsAnExistingEmail() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(new User()));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> authService.register(EMAIL, "alice", PASSWORD));

        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
    }

    @Test
    void loginSucceedsWithTheRightPassword() {
        User stored = userWithPassword(PASSWORD);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(stored));

        assertEquals(stored, authService.login(EMAIL, PASSWORD).user());
    }

    @Test
    void loginFailsWithAWrongPasswordOrAnUnknownEmail() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(userWithPassword(PASSWORD)));
        when(userRepository.findByEmail("inconnu@example.test")).thenReturn(Optional.empty());

        assertEquals(HttpStatus.UNAUTHORIZED,
                assertThrows(ResponseStatusException.class, () -> authService.login(EMAIL, "mauvais")).getStatusCode());
        assertEquals(HttpStatus.UNAUTHORIZED,
                assertThrows(ResponseStatusException.class,
                        () -> authService.login("inconnu@example.test", PASSWORD)).getStatusCode());
    }

    @Test
    void loginRefusesAccountsWithoutPassword() {
        User spotifyOnly = new User();
        spotifyOnly.setEmail(EMAIL);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(spotifyOnly));

        assertThrows(ResponseStatusException.class, () -> authService.login(EMAIL, PASSWORD));
    }

    @Test
    void guestIsATemporaryAccountWithoutPassword() {
        User guest = authService.guest("Invite du soir").user();

        assertEquals(true, guest.getGuest());
        assertNull(guest.getPasswordHash());
        assertEquals("Invite du soir", guest.getDisplayName());
    }

    private User userWithPassword(String password) {
        User user = new User();
        user.setId(1L);
        user.setEmail(EMAIL);
        user.setPasswordHash(passwordEncoder.encode(password));
        return user;
    }
}
