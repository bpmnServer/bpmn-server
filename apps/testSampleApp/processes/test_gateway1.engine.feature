Feature: test_gateway1

  Scenario: gateway1.js
    When @start process:test_gateway1 as :i
      | reminderCounter | 0 |
      | caseId | 9211 |
    And @invoke element:Activity_1 in :i
    And @check :i element:Activity_2_1 status is "wait"
    And @check :i element:Activity_2_2 status is "wait"
    And @check :i element:Activity_2_3 status is "wait"
    And @check :i element:Activity_2_4_1 status is "wait"
    And @check :i element:Activity_4 status is "wait"
    And @invoke element:Activity_2_1 in :i
    And @invoke element:Activity_2_2 in :i
    And @invoke element:Activity_2_3 in :i
    And @invoke element:Activity_2_4_1 in :i
    And @check :i element:Activity_3 status is "wait"
    And @check :i element:Activity_4 status is "wait"
    And @invoke element:Activity_3 in :i
    And @check :i element:Activity_3 status is "end"
    And @invoke element:Activity_4 in :i
    And @check :i element:Activity_4 status is "end"
