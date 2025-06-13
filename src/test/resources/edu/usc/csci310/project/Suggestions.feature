Feature: Test the suggest park feature
  Scenario: A user clicks the "Suggest Park" button without entering any usernames
    Given on "compare" page
    When click "suggestParkButton" button
    Then display "Please add user(s)." on page

  Scenario: A user adds a list of users but then clicks the clear button
    Given on "compare" page
    When I search "user1" in compare
    And click "clearCompareButton" button
    Then display "List cleared" on page

  Scenario: A user clicks the "Suggest Park" button but no common favorites exist
    Given on "compare" page
    When I search "user4" in compare
    And click "suggestParkButton" button
    Then display "No Suggestions" on page

  Scenario: A user clicks the "Suggest Park" button and there is a common favorite
    Given on "compare" page
    When I search "user5" in compare
    And click "suggestParkButton" button
    Then display "Yosemite National Park" on page

  Scenario: A user clicks the "Suggest Park" button and more than one common park
    Given on "compare" page
    When I search "user6" in compare
    And click "suggestParkButton" button
    Then display "Yosemite National Park" on page
    And display "Zion National Park" on page

  Scenario: A user clicks the display details button after getting a suggestion
    Given on "compare" page
    When I search "user5" in compare
    And click "suggestParkButton" button
    And click Yosemite National Park park name
    Then display "parkDetailsInline" on page
    And display "Yosemite National Park" on page
    And display "Amenities" on page
    And display "Activities" on page

  Scenario: trigger new location search from suggested park
    Given on "compare" page
    When I search "user5" in compare
    And click "suggestParkButton" button
    And click Yosemite National Park park name
    And click "parkLocation" button
    Then inline div is closed
    And display "CA" on page

  Scenario: trigger new activity search from suggested park
    Given on "compare" page
    When I search "user5" in compare
    And click "suggestParkButton" button
    And click Yosemite National Park park name
    And click "Biking" text
    Then inline div is closed
    And display "Acadia National Park" on page

  Scenario: trigger new amenity search from suggested park
    Given on "compare" page
    When I search "user5" in compare
    And click "suggestParkButton" button
    And click Yosemite National Park park name
    And click Accessible Rooms amenity
    Then inline div is closed
    And display "Alcatraz Island" on page
