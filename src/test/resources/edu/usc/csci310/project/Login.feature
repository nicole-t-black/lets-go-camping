Feature: Test the login/sign up functionality
  Scenario: choose sign up
    Given on login page
    When click "signUpRedirect" button
    Then redirected to "signup" page

  Scenario: click cancel from sign up page (view popup confirmation message)
    Given on "signup" page
    When click "cancelButton" button
    Then display "Are you sure you want to cancel?" on page

  Scenario: click cancel from sign up page (accept popup confirmation message)
    Given on "signup" page
    When click "cancelButton" button
    And click "confirmCancelButton" button
    Then redirected to "" page

  Scenario: click cancel from sign up page (deny popup confirmation message)
    Given on "signup" page
    When click "cancelButton" button
    And click "confirmNoCancelButton" button
    Then on "signup" page

  Scenario: successful registration
    Given on "signup" page
    When enter the username "tommytrojan"
    And enter the password "Password1"
    And confirm the password "Password1"
    And click "signUpButton" button
    Then redirected to "" page
    # "" will take you to login page

  Scenario: attempt registration with existing username
    Given on "signup" page
    And username "tommytrojan" and password "Password1" is already registered
    When enter the username "tommytrojan"
    And enter the password "Password1"
    And confirm the password "Password1"
    And click "signUpButton" button
    Then display "Username taken." on page

  Scenario: attempt registration missing username
    Given on "signup" page
    When enter the password "Password1"
    And confirm the password "Password1"
    And click "signUpButton" button
    Then display "Missing username. Please try again." on page

  Scenario: attempt registration missing password
    Given on "signup" page
    When enter the username "trojan"
    And click "signUpButton" button
    Then display "Missing password. Please try again." on page

  Scenario: attempt registration missing password confirmation
    Given on "signup" page
    When enter the username "tommy"
    And enter the password "Password1"
    And click "signUpButton" button
    Then display "Missing password. Please try again." on page
    # check for confirm password

  Scenario: attempt registration password mismatch
    Given on "signup" page
    When enter the username "trojan"
    And enter the password "Password1"
    And confirm the password "notPassword1"
    And click "signUpButton" button
    Then display "Password mismatch. Please try again." on page

  Scenario: password does not meet requirements (no capital)
    Given on "signup" page
    When enter the username "tommy"
    And enter the password "password1"
    And confirm the password "password1"
    And click "signUpButton" button
    Then display "Password does not meet requirements." on page

  Scenario: password does not meet requirements (no lowercase)
    Given on "signup" page
    When enter the username "tommy"
    And enter the password "PASSWORD1"
    And confirm the password "PASSWORD1"
    And click "signUpButton" button
    Then display "Password does not meet requirements." on page

  Scenario: password does not meet requirements (no number)
    Given on "signup" page
    When enter the username "tommy"
    And enter the password "Password"
    And confirm the password "Password"
    And click "signUpButton" button
    Then display "Password does not meet requirements." on page

  Scenario: successful login
    Given username "tommytrojan" and password "Password1" is already registered
    And on login page
    When enter the username "tommytrojan"
    And enter the password "Password1"
    And click "loginButton" button
    Then redirected to "search" page

  Scenario: an incorrect login with registered user
    Given username "tommytrojan" and password "Password1" is already registered
    And on login page
    When enter the username "tommytrojan"
    And enter the password "notPassword1"
    And click "loginButton" button
    Then display "Login unsuccessful, incorrect password." on page

  Scenario: an incorrect login with unregistered user
    Given on login page
    When enter the username "trojan"
    And enter the password "notPassword1"
    And click "loginButton" button
    Then display "Login unsuccessful, user not registered." on page

  Scenario: blank login attempt
    Given on login page
    When enter the username ""
    And enter the password ""
    And click "loginButton" button
    Then display "Login unsuccessful, username and password required." on page

  Scenario: empty password
    Given on login page
    When enter the username "tommytrojan"
    And click "loginButton" button
    Then display "Login unsuccessful, password required." on page

  Scenario: empty username
    Given on login page
    When enter the password "Password1"
    And click "loginButton" button
    Then display "Login unsuccessful, username required." on page

  Scenario: three incorrect logins in 1 minute
    Given on login page
    And username "tommytrojan" and password "Password1" is already registered
    And two previous unsuccessful login attempts
    When enter the username "tommytrojan"
    And enter the password "notPassword1"
    And click "loginButton" button
    Then display "Account blocked." on page

  Scenario: login attempt after account block is lifted
    Given on login page
    And account is currently locked
    When wait 31 seconds
    And click "popupCloseButton" button
    And enter the username "tommytrojan"
    And enter the password "Password1"
    And click "loginButton" button
    Then redirected to "search" page

  Scenario: three incorrect logins in more than 1 minute
    Given username "tommytrojan" and password "Password1" is already registered
    And two previous unsuccessful login attempts
    And on login page
    When wait 61 seconds
    And enter the username "tommytrojan"
    And enter the password "notPassword1"
    And click "loginButton" button
    Then display "Login unsuccessful, incorrect password." on page
