Feature: Test API

  Scenario: Test Writing an API
    Given the API client is opened
    When the enpoints are entered into the API
    Then the GET method gets the first post
			And the GET method gets all posts
			And the POST method inserts a post
			And the PUT method updates a post
			And the PATCH method updates a post
			And the DELETE method deletes the first post
