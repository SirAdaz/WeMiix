package com.wemiix.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wemiix.app.config.JwtConfig;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private static final String SECRET = "test-secret-at-least-32-characters-long";

    private final JwtService jwtService = serviceWithSecret(SECRET);

    private static JwtService serviceWithSecret(String secret) {
        return new JwtService(new JwtConfig(secret, 900L), new ObjectMapper());
    }

    @Test
    void validTokenReturnsItsClaims() {
        String token = jwtService.generateToken(42L, "a@example.test");

        JwtService.Claims claims = jwtService.validateToken(token).orElseThrow();

        assertEquals(42L, claims.userId());
        assertEquals("a@example.test", claims.email());
    }

    @Test
    void expiredTokenIsRejected() {
        String token = jwtService.generateToken(1L, "a@example.test", -10L);

        assertTrue(jwtService.validateToken(token).isEmpty());
    }

    @Test
    void tamperedPayloadIsRejected() {
        String[] parts = jwtService.generateToken(1L, "a@example.test").split("[.]");
        String otherPayload = jwtService.generateToken(2L, "b@example.test").split("[.]")[1];

        String forged = parts[0] + "." + otherPayload + "." + parts[2];

        assertTrue(jwtService.validateToken(forged).isEmpty());
    }

    @Test
    void tokenSignedWithAnotherSecretIsRejected() {
        String token = serviceWithSecret("another-secret-at-least-32-characters").generateToken(1L, "a@example.test");

        assertTrue(jwtService.validateToken(token).isEmpty());
    }

    @Test
    void malformedTokenIsRejected() {
        assertTrue(jwtService.validateToken("pas.un.jwt").isEmpty());
        assertTrue(jwtService.validateToken("abc").isEmpty());
    }
}
