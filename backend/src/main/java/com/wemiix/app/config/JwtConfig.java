package com.wemiix.app.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "auth")
public record JwtConfig(String secret, long tokenExpiration) {}
