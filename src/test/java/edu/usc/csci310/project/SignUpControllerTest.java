package edu.usc.csci310.project;

import edu.usc.csci310.project.controller.SignUpController;
import edu.usc.csci310.project.controller.SignUpRequest;
import edu.usc.csci310.project.controller.SignUpResponse;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
public class SignUpControllerTest {

    private static UserRepository userRepository;
    private static SignUpController SignUpController;

    @BeforeEach
    public void setUp() {
        userRepository = mock();
        SignUpController = new SignUpController(userRepository);
    }

    @Test
    void validSignUpTest() {
        String username = "validUsername";
        String password = "validPassword1";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(password);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Sign up successful.", SignUpResponse.getData());
    }

    @Test
    void usernameTakenSignUpTest() {
        String username = "takenUsername";
        String password = "validPassword1";
        User user = new User(username, password);
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(password);
        when(userRepository.findByUsername(username)).thenReturn(user);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Username taken.", SignUpResponse.getData());
    }

    @Test
    void upRequiredSignUpTest1() {
        String username = "";
        String password = "";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(password);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Missing username and password. Please try again.", SignUpResponse.getData());
    }

    @Test
    void upRequiredSignUpTest2() {
        String username = "";
        String password = "";
        String passwordConfirmation = "test";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(passwordConfirmation);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Missing username and password. Please try again.", SignUpResponse.getData());
    }

    @Test
    void upRequiredSignUpTest3() {
        String username = "";
        String password = "test";
        String passwordConfirmation = "";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(passwordConfirmation);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Missing username and password. Please try again.", SignUpResponse.getData());
    }

    @Test
    void uRequiredSignUpTest() {
        String username = "";
        String password = "validPassword1";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(password);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Missing username. Please try again.", SignUpResponse.getData());
    }

    @Test
    void pRequiredSignUpTest1() {
        String username = "validUsername";
        String password = "test";
        String passwordConfirmation = "";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(passwordConfirmation);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Missing password. Please try again.", SignUpResponse.getData());
    }

    @Test
    void pRequiredSignUpTest2() {
        String username = "validUsername";
        String password = "";
        String passwordConfirmation = "test";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(passwordConfirmation);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Missing password. Please try again.", SignUpResponse.getData());
    }

    @Test
    void pRequiredSignUpTest3() {
        String username = "validUsername";
        String password = "";
        String passwordConfirmation = "";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(passwordConfirmation);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Missing password. Please try again.", SignUpResponse.getData());
    }

    @Test
    void passwordMismatchSignUpTest() {
        String username = "validUsername";
        String password = "validPassword1";
        String passwordConfirmation = "notValidPassword1";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(passwordConfirmation);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Password mismatch. Please try again.", SignUpResponse.getData());
    }

    @Test
    void passwordReqsSignUpTest() {
        String username = "validUsername";
        String password = "invalidpassword";
        SignUpRequest SignUpRequest = new SignUpRequest();
        SignUpRequest.setUsername(username);
        SignUpRequest.setPassword(password);
        SignUpRequest.setPasswordConfirmation(password);
        when(userRepository.findByUsername(username)).thenReturn(null);

        ResponseEntity<SignUpResponse> response = SignUpController.SignUpAttempt(SignUpRequest);

        SignUpResponse SignUpResponse = response.getBody();
        assertNotNull(SignUpResponse);
        assertEquals("Password does not meet requirements. Passwords must have at least one capital letter, one lowercase letter, and one number.", SignUpResponse.getData());
    }

    @Test
    void gettersAndSettersAndConstructors() {
        String username = "validUsername";
        String password = "validPassword";
        User user = new User("validUsername", "validPassword");
        user.setUserID(1L);
        assertEquals(user.getUsername(), username);
        assertEquals(user.getPassword(), password);
        assertEquals(user.getUserID(), 1L);

        User user2 = new User();
        user2.setUsername("otherUsername");
        user2.setPassword("otherPassword");
        user2.setUserID(2L);
        assertEquals(user2.getUsername(), "otherUsername");
        assertEquals(user2.getPassword(), "otherPassword");
        assertEquals(user2.getUserID(), 2L);
    }
}