package com.example.Disaster_Relief.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String jwt;
    private Long userId;
    private String name;
    private String email;
    private String role;
}
