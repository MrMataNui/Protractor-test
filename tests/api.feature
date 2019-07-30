Feature: Test API

  Scenario: Test Writing an API
    Given the API client is opened
    When the enpoints are entered into the API
    Then the GET method succeeds
			And the POST method succeeds
			And the PUT method succeeds
			And the PATCH method succeeds
			And the DELETE method succeeds
