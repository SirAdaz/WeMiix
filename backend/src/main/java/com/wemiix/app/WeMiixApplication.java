package com.wemiix.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Point d'entrée principal de l'application WeMiix.
 * Application musicale festive : karaoké, blind test, playlists collaboratives.
 */
@SpringBootApplication
public class WeMiixApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeMiixApplication.class, args);
    }
}
