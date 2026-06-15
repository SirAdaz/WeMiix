package com.wemiix.app.service;

import com.wemiix.app.model.User;
import com.wemiix.app.model.UserMode;
import com.wemiix.app.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findOrCreateBySpotify(String spotifyId, String email, String displayName) {
        return userRepository.findBySpotifyId(spotifyId).orElseGet(() ->
            userRepository.findByEmail(email).map(existing -> {
                existing.setSpotifyId(spotifyId);
                existing.setDisplayName(displayName);
                return userRepository.save(existing);
            }).orElseGet(() -> {
                User newUser = new User();
                newUser.setSpotifyId(spotifyId);
                newUser.setEmail(email);
                newUser.setDisplayName(displayName);
                newUser.setUsername(displayName);
                return userRepository.save(newUser);
            })
        );
    }

    @Transactional(readOnly = true)
    public User findById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable : " + userId));
    }

    public User updateMode(Long userId, UserMode mode) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable : " + userId));
        user.setMode(mode);
        return userRepository.save(user);
    }
}
