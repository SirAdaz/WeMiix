package com.wemiix.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wemiix.app.config.JwtConfig;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@Service
public class JwtService {

    private final JwtConfig jwtConfig;
    private final ObjectMapper objectMapper;

    public JwtService(JwtConfig jwtConfig, ObjectMapper objectMapper) {
        this.jwtConfig = jwtConfig;
        this.objectMapper = objectMapper;
    }

    public record Claims(Long userId, String email) {}

    public String generateToken(Long userId, String email) {
        return generateToken(userId, email, jwtConfig.tokenExpiration());
    }

    public String generateToken(Long userId, String email, long expirationSeconds) {
        try {
            String header = Base64.getUrlEncoder().withoutPadding().encodeToString(
                objectMapper.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT"))
            );

            long now = Instant.now().getEpochSecond();
            String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(
                objectMapper.writeValueAsBytes(Map.of(
                    "sub", String.valueOf(userId),
                    "email", email,
                    "iat", now,
                    "exp", now + expirationSeconds
                ))
            );

            String signingInput = header + "." + payload;
            return signingInput + "." + sign(signingInput);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du token JWT", e);
        }
    }

    public Optional<Claims> validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return Optional.empty();

            String signingInput = parts[0] + "." + parts[1];
            if (!sign(signingInput).equals(parts[2])) return Optional.empty();

            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            JsonNode payload = objectMapper.readTree(payloadBytes);

            long exp = payload.path("exp").asLong();
            if (Instant.now().getEpochSecond() > exp) return Optional.empty();

            Long userId = Long.parseLong(payload.path("sub").asText());
            String email = payload.path("email").asText();

            return Optional.of(new Claims(userId, email));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private String sign(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(
            jwtConfig.secret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"
        );
        mac.init(keySpec);
        return Base64.getUrlEncoder().withoutPadding()
            .encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
    }
}
