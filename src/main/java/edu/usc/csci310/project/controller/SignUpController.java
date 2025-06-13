package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.regex.*;

@RestController
@AllArgsConstructor
@Slf4j
public class SignUpController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponse> SignUpAttempt(@RequestBody SignUpRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();
        String passwordConfirmation = request.getPasswordConfirmation();
        SignUpResponse response = new SignUpResponse();

        response.setData("Sign up successful.");

        User user = userRepository.findByUsername(username);
        if (user != null) {
            response.setData("Username taken.");
        } else {
            // Missing inputs
            if (username.isEmpty() && (password.isEmpty() || passwordConfirmation.isEmpty())) {
                response.setData("Missing username and password. Please try again.");
            } else if (username.isEmpty()) {
                response.setData("Missing username. Please try again.");
            } else if (password.isEmpty() || passwordConfirmation.isEmpty()) {
                response.setData("Missing password. Please try again.");
            }

            if (!username.isEmpty() && !password.isEmpty() && !passwordConfirmation.isEmpty()) {
                // Passwords don't match
                if (!password.equals(passwordConfirmation)) {
                    response.setData("Password mismatch. Please try again.");
                    return ResponseEntity.ok().body(response);
                }
                // Password doesn't follow requirements
                String regex = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{1,}$";
                Pattern p = Pattern.compile(regex);
                Matcher m = p.matcher(password);
                if (!m.matches()) {
                    response.setData("Password does not meet requirements. Passwords must have at least one capital letter, one lowercase letter, and one number.");
                }
            }
        }

        if(response.getData().equals("Sign up successful.")) {
            User newuser = new User(username, password);
            userRepository.save(newuser);
        }
        return ResponseEntity.ok().body(response);
    }
}

