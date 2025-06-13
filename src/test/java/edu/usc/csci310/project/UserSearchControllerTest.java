package edu.usc.csci310.project;

import edu.usc.csci310.project.controller.LoginResponse;
import edu.usc.csci310.project.controller.UserSearchController;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class UserSearchControllerTest {
    private static UserSearchController userSearchController;
    private static UserRepository userRepository;

    @BeforeEach
    public void setUp() throws Exception {
        userRepository = mock();
        userSearchController = new UserSearchController(userRepository);
    }

    @Test
    void validUsernamePublicList() {
        String username = "validUsername";
        User user = new User();
        user.setUsername(username);
        user.setUserID(1L);
        user.setFavListIsPrivate(false);

        when(userRepository.findByUsername(username)).thenReturn(user);

        ResponseEntity<LoginResponse> response = userSearchController.handleUserSearch(username);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Successfully Added User", loginResponse.getData());
    }

    @Test
    void validUsernamePrivateList() {
        String username = "validUsername";
        User user = new User();
        user.setUsername(username);
        user.setFavListIsPrivate(true);


        when(userRepository.findByUsername(username)).thenReturn(user);

        ResponseEntity<LoginResponse> response = userSearchController.handleUserSearch(username);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Invalid Username: user's list is private", loginResponse.getData());
    }

    @Test
    void invalidUsername() {
        String username = "invalidUsername";

        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<LoginResponse> response = userSearchController.handleUserSearch(username);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Invalid Username: user does not exist", loginResponse.getData());
    }

    @Test
    void gettersAndSettersAndConstructors() {
        LoginResponse loginResponse = new LoginResponse();

        //test id getter and setter
        long testId = 1L;
        loginResponse.setId(testId);
        testId = loginResponse.getId();

        assertEquals(testId,1L);
    }

}