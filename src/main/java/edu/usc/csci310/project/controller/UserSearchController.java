package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserSearchController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    public UserSearchController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<LoginResponse> handleUserSearch(@RequestParam String username) {
        LoginResponse response = new LoginResponse();

        User user = userRepository.findByUsername(username);

        //found a user object with this username
        if(user != null) {
            //check if list is public
            boolean listIsPrivate = user.getFavListIsPrivate();
            if(!listIsPrivate) {
                response.setData("Successfully Added User");
                //need to send id to front end to add to list
                response.setId(user.getUserID());
            }
            else {
                //users list is private
                response.setData("Invalid Username: user's list is private");
            }
        }
        else {
            //user does not exist
            response.setData("Invalid Username: user does not exist");
        }

        return ResponseEntity.ok().body(response);
    }

}
