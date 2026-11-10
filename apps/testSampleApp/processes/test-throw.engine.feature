Feature: test-throw

  Scenario: Issue124-2.js
    When @start process:test-throw as :i
      | caseId | 9301 |
    And @check items 1
      | name | "test-throw" |
      | data.caseId | 9301 |
      | items.status | "wait" |
    And @find item in :i as :waiting
      | item.status | "wait" |
    And @invoke :waiting
    And @wait instances 1 within 20 seconds
      | name | "test-catch" |
      | data.caseId | 9301 |

  Scenario: throw-catch.js
    When @start process:test-throw as :i
      | caseId | 9302 |
    And @check items 1
      | name | "test-throw" |
      | data.caseId | 9302 |
      | items.status | "wait" |
    And @find item in :i as :waiting
      | item.status | "wait" |
    And @invoke :waiting
    And @wait instances 1 within 20 seconds
      | name | "test-catch" |
      | data.caseId | 9302 |
