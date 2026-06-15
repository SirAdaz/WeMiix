package com.wemiix.app.controller;

import com.wemiix.app.model.User;
import com.wemiix.app.model.UserMode;
import com.wemiix.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/mode")
    public ResponseEntity<User> updateMode(
            @PathVariable Long id,
            @RequestBody UpdateModeRequest request) {
        UserMode mode = parseMode(request.mode());
        User user = userService.updateMode(id, mode);
        return ResponseEntity.ok(user);
    }

    private UserMode parseMode(String mode) {
        if (mode == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le mode est requis (CHILD ou ADULT)");
        }
        return switch (mode.toUpperCase()) {
            case "CHILD" -> UserMode.CHILD;
            case "ADULT" -> UserMode.ADULT;
            default -> throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Mode invalide : " + mode + ". Valeurs acceptées : CHILD, ADULT");
        };
    }

    record UpdateModeRequest(String mode) {}
}
