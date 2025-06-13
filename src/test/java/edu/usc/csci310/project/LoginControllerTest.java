package edu.usc.csci310.project;

import edu.usc.csci310.project.controller.LoginController;
import edu.usc.csci310.project.controller.LoginRequest;
import edu.usc.csci310.project.controller.LoginResponse;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
public class LoginControllerTest {

    private static UserRepository userRepository;
    private static LoginController loginController;

    @BeforeEach
    public void setUp() throws Exception {
        userRepository = mock();
        loginController = new LoginController(userRepository);
    }

    @Test
    void startTimerTest() throws InterruptedException {
        loginController.setLoginsAttempted(1);
        loginController.startTimer(1);
        Thread.sleep(2000);
        assertEquals(0, loginController.getLoginsAttempted());
    }
    @Test
    void validLoginTest() {
        loginController.setLoginsAttempted(0);
        String username = "validUsername";
        String password = "validPassword";
        User user = new User(username, password);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);
        when(userRepository.findByUsernameAndPassword(username, password)).thenReturn(user);

        ResponseEntity<LoginResponse> response = loginController.login(loginRequest);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Login successful.", loginResponse.getData());
        assertEquals(user, loginResponse.getUser());
    }

    @Test
    void upRequiredLoginTest() {
        loginController.setLoginsAttempted(0);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("");
        loginRequest.setPassword("");
        when(userRepository.findByUsernameAndPassword("", "")).thenReturn(null);

        ResponseEntity<LoginResponse> response = loginController.login(loginRequest);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Login unsuccessful, username and password required.", loginResponse.getData());
    }

    @Test
    void uRequiredLoginTest() {
        loginController.setLoginsAttempted(0);
        String password = "testPassword";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("");
        loginRequest.setPassword(password);
        when(userRepository.findByUsernameAndPassword("", password)).thenReturn(null);

        ResponseEntity<LoginResponse> response = loginController.login(loginRequest);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Login unsuccessful, username required.", loginResponse.getData());
    }

    @Test
    void pRequiredLoginTest() {
        loginController.setLoginsAttempted(0);
        String username = "testUsername";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword("");
        when(userRepository.findByUsernameAndPassword(username, "")).thenReturn(null);

        ResponseEntity<LoginResponse> response = loginController.login(loginRequest);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Login unsuccessful, password required.", loginResponse.getData());
    }

    @Test
    void incorrectPasswordLoginTest() {
        loginController.setLoginsAttempted(0);
        String username = "validUsername";
        String password = "validPassword";
        String invalid_password = "invalidPassword";
        User user = new User(username, password);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(userRepository.findByUsernameAndPassword(username, invalid_password)).thenReturn(null);

        ResponseEntity<LoginResponse> response = loginController.login(loginRequest);
        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Login unsuccessful, incorrect password.", loginResponse.getData());
    }

    @Test
    void unregisteredLoginTest() {
        loginController.setLoginsAttempted(0);
        String username = "invalidUsername";
        String password = "invalidPassword";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);
        when(userRepository.findByUsernameAndPassword(username, password)).thenReturn(null);

        ResponseEntity<LoginResponse> response = loginController.login(loginRequest);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Login unsuccessful, user not registered.", loginResponse.getData());
    }

    @Test
    void accountBlockedTest() {
        loginController.setLoginsAttempted(2);
        String username = "invalidUsername";
        String password = "invalidPassword";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);
        when(userRepository.findByUsernameAndPassword(username, password)).thenReturn(null);

        ResponseEntity<LoginResponse> response = loginController.login(loginRequest);

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);
        assertEquals("Account blocked.", loginResponse.getData());
    }
}
