Feature: test_gateway5

  Scenario: gateway5.js
    When @start process:test_gateway5 as :i
      | caseId | 9216 |
    And @check :i element:Activity_1m6hqy8 status is "wait"
    And @invoke element:Activity_1m6hqy8 in :i
      | vote | "true" |
    And @check :i element:Gateway_1jwui8m status is "end"
    And @check :i element:Event_1b19bas status is "end"
    And @check :i element:Activity_1uh26d0 status is "wait"
