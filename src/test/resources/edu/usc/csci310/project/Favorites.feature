Feature: Test the favorites page functionality
  Scenario: redirection to compare/suggest
    Given on "favorites" page
    When click "compareRedirect" button
    Then redirected to "compare-suggest" page

  Scenario: redirection to search
    Given on "favorites" page
    When click "searchRedirect" button
    Then redirected to "search" page

  Scenario: redirection to log out
    Given on "favorites" page
    When click "logOutRedirect" button
    Then redirected to "" page

  Scenario: redirection to favorites
    Given on "favorites" page
    When click "favoritesRedirect" button
    Then redirected to "favorites" page

  Scenario: add park to favorites
    Given on "search" page
    And search "Yosemite"
    When add "Yosemite National Park" to favorites
    And click "favoritesRedirect" button
    Then display "Yosemite National Park" on page

  Scenario: remove park from favorites
    Given on "favorites" page
    And display "Zion National Park" on page
    When click "removeFavoriteButton" button
    And display "Are you sure you want to remove from favorites?" on page
    And click "confirmRemoveButton" button
    Then display empty favorites page

  Scenario: remove park from favorites and deny confirmation
    Given on "favorites" page
    And display "Zion National Park" on page
    When click "removeFavoriteButton" button
    And display "Are you sure you want to remove from favorites?" on page
    And click "confirmNoRemoveButton" button
    Then display "Zion National Park" on page

  Scenario: remove every park in list
    Given on "favorites" page
    And display "Zion National Park" on page
    And display "Yosemite National Park" on page
    When click "removeAllFavoritesButton" button
    And display "Are you sure you want to remove all favorites?" on page
    And click "confirmRemoveAllButton" button
    Then display empty favorites page

  Scenario: remove every park in list and deny confirmation
    Given on "favorites" page
    And display "Yosemite National Park" on page
    When click "removeAllFavoritesButton" button
    And display "Are you sure you want to remove all favorites?" on page
    And click "confirmNoRemoveAllButton" button
    Then display "Yosemite National Park" on page

  Scenario: move park up in ranking
    Given on "favorites" page
    And display "Yosemite National Park" above "Zion National Park"
    When click move up ranking on "Zion National Park"
    Then display "Zion National Park" above "Yosemite National Park"

  Scenario: move park down in ranking
    Given on "favorites" page
    And display "Yosemite National Park" above "Zion National Park"
    When click move down ranking on "Yosemite National Park"
    Then display "Zion National Park" above "Yosemite National Park"

  Scenario: making list public
    Given on "favorites" page
    And favorites list is private
    When click "togglePrivateButton" button
    Then boolean private "false"

  Scenario: making list private
    Given on "favorites" page
    And favorites list is public
    Then click "togglePrivateButton" button
    And boolean private "true"

  Scenario: favorites list default private
    Given on "favorites" page
    Then boolean private "true"
