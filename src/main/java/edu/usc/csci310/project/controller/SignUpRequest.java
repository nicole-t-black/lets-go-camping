package edu.usc.csci310.project.controller;

public class SignUpRequest {
    private String username;
    private String password;

    private String passwordConfirmation;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getPasswordConfirmation() { return passwordConfirmation;}

    public void setUsername(String data) {
        this.username = data;
    }

    public void setPassword(String data) {
        this.password = data;
    }

    public void setPasswordConfirmation(String data) { this.passwordConfirmation = data; }
}

