package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Timer;
import java.util.TimerTask;

@RestController
public class LoginController {
    private int loginsAttempted = 0;

    public void setLoginsAttempted(int loginsAttempted) {
        this.loginsAttempted = loginsAttempted;
    }

    public int getLoginsAttempted() {
        return loginsAttempted;
    }

    @Autowired    private UserRepository userRepository;


    @Autowired
    public LoginController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void startTimer(int time) {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                loginsAttempted = 0; // after 1 minute the timer resets and sets login attempts to 0
            }
        }, time* 1000L);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = new LoginResponse();

        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        User user = userRepository.findByUsernameAndPassword(username, password);
        User user1 = userRepository.findByUsername(username);
        if (user != null) {
            response.setData("Login successful.");
            response.setUser(user);
            loginsAttempted = 0;
        } else {
            loginsAttempted++;
            if (loginsAttempted == 1) { // first error start 1 minute timer
                startTimer(60);
            }
            if (loginsAttempted < 3) {
                if (username.isEmpty() && password.isEmpty()) {
                    response.setData("Login unsuccessful, username and password required.");
                } else if (username.isEmpty()) {
                    response.setData("Login unsuccessful, username required.");
                } else if (password.isEmpty()) {
                    response.setData("Login unsuccessful, password required.");
                } else if (user1 != null) {
                    response.setData("Login unsuccessful, incorrect password.");
                } else {
                    response.setData("Login unsuccessful, user not registered.");
                }
            } else {
                loginsAttempted = 0;
                response.setData("Account blocked.");
            }
        }

        return ResponseEntity.ok().body(response);
    }
}
