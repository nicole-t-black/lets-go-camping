Feature: Test the compare lists with friends feature
  Scenario: redirection to compare/suggest
    Given on "compare-suggest" page
    When click "compare-suggest" button
    Then redirected to "compare-suggest" page

  Scenario: redirection to search
    Given on "compare-suggest" page
    When click "search" button
    Then redirected to "search" page

  Scenario: redirection to log out
    Given on "compare-suggest" page
    When click "signOut" button
    Then redirected to "" page

  Scenario: redirection to favorites
    Given on "compare-suggest" page
    When click "favorites" button
    Then redirected to "favorites" page

  Scenario: User clicks the compare button without any inputs
    Given on "compare-suggest" page
    When click "compare" button
    Then display "Please add user(s)." on page

  Scenario: A user searches for a username that does not exist
    Given on "compare-suggest" page
    When I search "2" in compare
    Then display "Invalid Username: user does not exist" on page

  Scenario: A user searches for a username that has a private list
    Given on "compare-suggest" page
    When I search "user3test" in compare
    Then display "Invalid Username: user's list is private" on page

  Scenario: A user adds a list of users, clicks clear button, and compares
    Given on "compare-suggest" page
    When I search "user5test" in compare
    And click "clear" button
    And click "compare" button
    Then display "Please add user(s)." on page

  Scenario: A user correctly compares with a friend
    Given on "compare-suggest" page
    When I search "user5test" in compare
    And click "compare" button
    Then display "Compare results successful." on page
    And display "Yosemite National Park" on page
    And display "Zion National Park" on page

  Scenario: Correct ordering and displayed ratios of compared favorites
    Given on "compare-suggest" page
    When I search "user1test" in compare
    And I search "user7test" in compare
    And click "compare" button
    Then display "Compare results successful." on page
    And display "Zion National Park" on page
    And display "Yosemite National Park" on page
    And display "Death Valley National Park" on page

  Scenario: Hover over park's ratio
    Given on "compare-suggest" page
    When I search "user1test" in compare
    And I search "user7test" in compare
    And click "compare" button
    And I hover over yosemite national park ratio
    Then display "user0test, user1test" on page

  Scenario: User clicks the display details button after comparing
    Given on "compare-suggest" page
    When I search "user1test" in compare
    And I search "user5test" in compare
    And click "compare" button
    And click Yosemite National Park park name
    Then display "Yosemite National Park" on page
    And display "Amenities" on page
    And display "Activities" on page

#  - user 0 has 2 favorites (Yosemite and Zion)
#  - user 1 has two favorites (Yosemite and Zion)
#  - user 2 does not exist
#  - user 3 has a private list
#  - user 4 has 1 favorite (Joshua Tree)
#  - user 5 has 1 favorite (Yosemite)
#  - user 6 ???
#  - user 7 has 2 favorites (Death Valley and Zion)
