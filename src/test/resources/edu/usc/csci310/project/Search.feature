Feature: testing Search feature

  Scenario: Trigger Key Word Search with Enter
    Given on "search" page
    When search "Yellowstone"
    Then display "Yellowstone National Park" on page

  Scenario: Default Search Filter is Park Name
    Given on "search" page
    When search ""
    Then display "Park Name" on page

  Scenario: Filter Search by Park Name
    Given on "search" page
    When Click filter by "Park Name"
    Then display "Park Name" on page

  Scenario: Filter Search by State
    Given on "search" page
    When Click filter by "State"
    Then display "State" on page

  Scenario: Filter Search by Activity
    Given on "search" page
    When Click filter by "Activity"
    Then display "Activity" on page

  Scenario: Filter Search by Amenity
    Given on "search" page
    When Click filter by "Amenity"
    Then display "Amenity" on page

  Scenario: Load More Results
    Given on "search" page
    When search "National Park"
    And click "loadMoreButton" button
    Then 10 more results appear

  Scenario: Load No More Results
    Given on "search" page
    When search "Oklahoma"
    Then "loadMoreButton" is not displayed

  Scenario: Click Park Name to Learn More About a Park (Minimizing Window Launch)
    Given on "search" page
    When search "Yellowstone National Park"
    And click Yellowstone National Park park name
    Then display "parkDetailsInline" on page

  Scenario: Click Location in Minimizing Window (Trigger New Location Search)
    Given on "search" page
    When search "Yellowstone National Park"
    And click Yellowstone National Park park name
    And click "parkLocation" button
    Then display "MT" on page

  Scenario: Click Activity in Minimizing Window (Trigger New Activity Search)
    Given on "search" page
    When search "Yellowstone National Park"
    And click Yellowstone National Park park name
    And click "Snowmobiling" text
    And inline div is closed
    Then display "Acadia National Park" on page

  Scenario: Click Amenity in Minimizing Window (Trigger New Amenity Search)
    Given on "search" page
    When search "Yellowstone National Park"
    And click Yellowstone National Park park name
    And click Accessible Rooms amenity
    Then display "Yellowstone National Park" on page

  Scenario: Click Name of Park (Minimizing Window Close)
    Given on "search" page
    When search "Yellowstone National Park"
    And click Yellowstone National Park park name
    And click Yellowstone National Park park name
    Then inline div is closed

  Scenario: redirection to search
    Given on "search" page
    When click "searchRedirect" button
    Then redirected to "search" page

  Scenario: redirection to log out
    Given on "search" page
    When click "logOutRedirect" button
    Then redirected to "" page

  Scenario: redirection to compare/suggest
    Given on "search" page
    When click "compareRedirect" button
    Then redirected to "compare-suggest" page

  Scenario: redirection to favorites
    Given on "search" page
    When click "favoritesRedirect" button
    Then redirected to "favorites" page
