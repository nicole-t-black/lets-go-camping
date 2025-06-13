package edu.usc.csci310.project.controller;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {
    private String username;

    private String password;
}
