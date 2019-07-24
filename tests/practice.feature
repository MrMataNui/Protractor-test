Feature: Travelocity

  Scenario: Travelocity successful query
    Given Travelocity is opened
    When it runs the tests
    Then it should submit travel information

  Scenario: Travelocity errors
    Given Travelocity is opened
    When bad info is presented
    Then it should present destination errors
    And it should present flight errors
    And it should present traveller errors
    And it should present ageSelect errors
    And it should present dateSelect errors
