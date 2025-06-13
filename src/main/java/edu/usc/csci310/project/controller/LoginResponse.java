package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.model.User;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginResponse {
    private String data;

    private User user;

    private long id;

}