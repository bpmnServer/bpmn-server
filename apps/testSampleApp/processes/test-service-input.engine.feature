Feature: test-service-input

  Scenario: serviceInput.js
    When @start process:test-service-input as :i
      | caseId | 6001 |
    And @check :i element:service1 status is "end"
