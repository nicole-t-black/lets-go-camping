Feature: Test the security functionaliy of login/sign up feature

  Scenario: successful registration of a similiar username, not similiar password
    And username "tommytrojan" and password "Password1" is already registered
    When enter the username "tommytrojaN"
    And enter the password "Qwerty2003"
    And confirm the password "Qwerty2003"
    And click "signUpButton" button
    Then redirected to "" page

  Scenario: successful registration of a similiar password, not similiar username
    And username "tommytrojan" and password "Password1" is already registered
    When enter the username "tommytrojan2"
    And enter the password "pAssword1"
    And confirm the password "pAssword1"
    And click "signUpButton" button
    Then redirected to "" page

  Scenario: an incorrect login using similiar password credentials as registered user
    Given on login page
    And username "tommytrojan" and password "Password1" is already registered
    When enter the username "tommytrojan"
    And enter the password "pAssword1"
    And click "loginButton" button
    Then display "Login unsuccessful, incorrect password." on page

  Scenario: an incorrect login using similiar username credentials as registered user
    Given on login page
    And username "tommytrojan" and password "Password1" is already registered
    When enter the username "tommytrojaN"
    And enter the password "Password1"
    And click "loginButton" button
    Then display "Login unsuccessful, user not registered." on page

  Scenario: unregistered user attempts to route to favorites page
    Given on login page
    When navigate to url of "search" page
    Then redirected to "" page

  Scenario: unregistered user attempts to route to search page
    Given on login page
    When navigate to url of "favorites" page
    Then redirected to "" page

  Scenario: unregistered user attempts to route to compare page
    Given on login page
    When navigate to url of "compare" page
    Then redirected to "" page

  Scenario: Session management
    Given a user session
    When the session is inactive for a given time period
    Then redirected to "" page
    And new session
