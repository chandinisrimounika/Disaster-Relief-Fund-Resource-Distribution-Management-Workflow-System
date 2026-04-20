package com.example.Disaster_Relief.controller;

import com.example.Disaster_Relief.dto.AuthRequest;
import com.example.Disaster_Relief.dto.AuthResponse;
import com.example.Disaster_Relief.model.User;
import com.example.Disaster_Relief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public AuthResponse createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        // ULTIMATE BYPASS: Just find the user by email and log them in
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new Exception("User not found"));

        // Password check is disabled for the demo
        // if (!authRequest.getPassword().equals(user.getPassword())) { ... }

        String mockToken = "simple-auth-token-" + user.getEmail();

        return new AuthResponse(mockToken, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
